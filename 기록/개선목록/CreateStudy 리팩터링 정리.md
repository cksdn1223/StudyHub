# CreateStudy 리팩터링 정리 (react-hook-form + Zod)

## 1. 리팩터링 목표
기존 CreateStudy는 `useState(studyData)` + `handleCreate` 내부에서 **수동 if-check**로 필수값을 검증하고, 각 입력 필드가 `handleChange`로 한 번에 상태를 갱신하는 구조였다.

이 방식은:
- 검증 로직이 UI 컴포넌트(CreateStudy) 안에 섞여서 커지고
- 에러 표시 방식이 Toast 중심이라 **필드 단위 에러 UX**가 약하며
- 태그/주소 같은 부가 기능이 한 컴포넌트에 몰려 가독성이 떨어지고
- 타입/검증 흐름이 분산돼 유지보수가 어려웠다.

따라서 이번 리팩터링의 핵심 목표는 다음과 같다.

- **폼 상태 관리**: react-hook-form(RHF)로 통합
- **검증 스키마화**: Zod 스키마로 검증 규칙을 한 곳에서 선언
- **로직/뷰 분리**: 주소 검색, 태그 선택, 폼 제출을 커스텀 훅으로 분리
- **UI 모듈화**: TagSection/AddressSection으로 JSX 단순화
- **에러 표시 표준화**: InputField/SelectField가 에러를 직접 렌더링
- **타입 안정화**: `any` 제거, `StudyFormValues`를 단일 타입 소스로 사용

---

## 2. 변경 전/후 구조 비교

### Before
- `CreateStudy.tsx` 하나에:
  - state(`studyData`, `tag`, `isFocused`, `isAddressLoading`) + 핸들러 + UI가 몰림
  - `handleCreate()`에서 `if (!xxx) return showToast(...)` 반복
  - 입력값 검증 규칙이 코드에 흩어짐

### After
- CreateStudy는 “화면 조립”에 집중하고,
- 폼 상태/검증/제출은 RHF + Zod + 훅으로 분리

구성 요소:
- `studySchema.ts` : 검증 규칙(Zod) + `StudyFormValues` 타입
- `studyDefaults.ts` : defaultValues(초기값)
- `useStudyForm.ts` : RHF 초기화(resolver 포함)
- `useAddressSearch.ts` : 주소 검색 + 좌표 세팅 로직
- `useTagSelector.ts` : 태그 입력/자동완성/추가/삭제 로직
- `TagSection.tsx` : 태그 입력 UI
- `AddressSection.tsx` : 주소 입력 UI
- `InputField.tsx`, `SelectField.tsx` : 에러/접근성/forwardRef 지원

---

## 3. 파일/폴더 구조 예시
```
CreateStudy/
CreateStudy.tsx
studySchema.ts
studyDefaults.ts
useStudyForm.ts
useAddressSearch.ts
useTagSelector.ts
TagSection.tsx
AddressSection.tsx
````

---

## 4. 스키마 기반 검증 도입 (Zod)

### 4.1 스키마를 한 곳에서 선언
필수값/최소값 등 모든 검증을 `studySchema.ts`에 모은다.

- title/description/frequency/duration/detailLocation/address: 필수
- tags: 최소 1개
- memberCount/maxMembers/latitude/longitude: number
- 추가적으로 `maxMembers >= memberCount` 같은 **교차 검증(refine)**도 가능

### 4.2 타입은 스키마에서 추론 (단일 진실)
```ts
export type StudyFormValues = z.infer<typeof studySchema>;
````

이 타입을:

* `useForm<StudyFormValues>()`
* `useAddressSearch / useTagSelector`
* `onSubmit(data: StudyFormValues)`
* API 호출 payload 타입

에 전부 동일하게 사용해서 **any 제거 + 타입 일관성 확보**.

---

## 5. react-hook-form 적용 (useStudyForm)

### 5.1 resolver로 스키마 연결

```ts
useForm<StudyFormValues>({
  resolver: zodResolver(studySchema),
  defaultValues,
});
```

### 5.2 Controller 사용 이유

현재 InputField/SelectField는 “커스텀 컴포넌트”이므로,
RHF의 `register`를 직접 쓰는 것보다 `Controller`가 안전하다.

Controller는:

* `field.value / field.onChange / field.onBlur / field.ref` 를 제공하고
* 이 값들을 InputField/SelectField에 주입하여 RHF가 상태를 관리한다.

---

## 6. InputField / SelectField 개선

### 6.1 에러 메시지 렌더링 지원

* `errorMessage?: string` prop 추가
* 에러가 있으면 input/select 하단에 텍스트 표시

### 6.2 접근성(Accessibility) 개선

* `aria-invalid={!!errorMessage}` 적용
* label의 `htmlFor`가 실제 `id`를 가리키도록 개선

### 6.3 forwardRef 도입

RHF Controller가 전달하는 `ref`를 실제 `<input>`, `<textarea>`, `<select>`에 연결하기 위해

* InputField, SelectField 모두 `forwardRef` 기반으로 변경

이걸 안 하면 다음 경고가 발생:

> Function components cannot be given refs...

---

## 7. 로직 분리: 커스텀 훅

### 7.1 useAddressSearch

역할:

* 다음 주소 검색 열기
* 주소 선택 후 `getLocation()` 호출로 좌표 조회
* `setValue("address")`, `setValue("latitude")`, `setValue("longitude")`로 폼 값 반영
* 로딩 상태 `isAddressLoading` 관리

효과:

* CreateStudy에서 주소 관련 try/catch/로딩 관리가 빠져 코드가 단순해짐

### 7.2 useTagSelector

역할:

* 태그 입력값(tag) 상태
* 자동완성 목록(filteredTags)
* addTag/removeTag
* focus/blur 처리(isFocused)

#### ✅ 중요한 포인트: tags는 getValues가 아니라 watch로 구독

초기 구현에서 `getValues("tags")`를 memo로 고정하면,
tags가 최신 값으로 갱신되지 않아 “추가했는데 안 보임” 문제가 발생할 수 있다.

따라서:

* `const tags = watch("tags") ?? EMPTY_ARRAY;` 로 폼 tags를 구독
* `setValue("tags", [...tags, t], { shouldValidate: true, shouldDirty: true })`

#### eslint 경고 처리

`watch("tags") ?? []`는 `[]`가 매 렌더마다 새 배열이 되어 deps 경고가 뜰 수 있음.
그래서 고정 상수 사용:

```ts
const EMPTY_ARRAY: string[] = [];
const tags = watch("tags") ?? EMPTY_ARRAY;
```

---

## 8. UI 분리: Presentational Component

### 8.1 TagSection

* 입력창 + “추가” 버튼 + 추천 리스트 + 현재 태그 리스트를 담당
* 내부에서 addTag/removeTag 핸들러만 호출

### 8.2 AddressSection

* 주소 입력(읽기 전용) + “주소 찾기” 버튼 + 상세 주소 입력을 담당
* 주소 선택 로직은 useAddressSearch에 존재

효과:

* CreateStudy JSX가 훨씬 짧아지고
* 섹션 단위로 수정이 쉬워짐

---

## 9. 제출 처리 통일

### 9.1 handleCreate 제거

기존:

* handleCreate에서 if-check 반복 + toast

변경:

* `handleSubmit(onSubmit)`을 사용
* 검증 실패 시 `errors`에 자동 반영 → 필드별 메시지 출력
* 성공 시에만 `createStudy(data)` 호출

### 9.2 로딩/비활성 상태

* RHF `formState.isSubmitting` 사용
* 버튼 disabled, 로딩 텍스트 통일

---

## 10. 타입(any) 제거 원칙

* onSubmit: `async (data: StudyFormValues) => { ... }`
* InputField/SelectField: forwardRef로 ref 타입 안정화
* errors 메시지는 `fieldState.error?.message` 사용(강제 캐스팅 최소화)
* API createStudy도 가능하면 `createStudy(payload: StudyFormValues)` 형태로 맞춤

---

## 11. 최종적으로 얻은 이점

* 검증 로직이 스키마로 모여 **수정/추가가 쉬움**
* CreateStudy 컴포넌트가 얇아져 **가독성/유지보수성 향상**
* 태그/주소 같은 부가 기능이 훅으로 분리되어 **재사용 가능**
* 에러 표시가 필드 단위로 통일되어 **UX 개선**
* forwardRef + 타입 통일로 **경고/any 제거, 안정성 상승**
