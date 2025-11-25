# QueryDSL을 사용하는 이유
**타입 안전성(Type Safety)** 과 **동적 쿼리(Dynamic Query) 작성의 용이성** 때문입니다.

대규모 프로젝트에서 SQL을 직접 작성하거나 JPA의 JPQL을 문자열로 다룰 때 발생하는 여러 문제점을 해결하고 개발 생산성을 높이기 위해 QueryDSL을 사용합니다.

-----

## 1\. 🛡️ 타입 안전성 확보 (Type Safety)

QueryDSL을 사용하는 가장 중요한 이유입니다.

  * **컴파일 시점 오류 포착:** SQL이나 JPQL을 문자열로 작성하면, 오타가 있어도 **컴파일 단계에서는 오류를 잡아낼 수 없습니다.** 오직 애플리케이션 실행 후 해당 코드가 호출될 때(런타임) `Syntax Error`나 `Field Not Found Error`가 발생합니다.
  * **QueryDSL의 해결:** QueryDSL은 엔티티를 기반으로 **Q-Class**라는 정적 타입을 생성합니다.  개발자는 이 Q-Class를 사용하여 쿼리를 작성합니다. 따라서 필드 이름에 오타가 있거나 존재하지 않는 필드를 참조하면 **컴파일 시점에 즉시 오류가 발생**하여, 런타임에 발생하는 치명적인 버그를 미리 방지할 수 있습니다.

-----

## 2\. 🧩 동적 쿼리 작성 용이성

스터디 매칭 서비스처럼 **검색 조건이 유동적**인 경우, QueryDSL은 매우 강력한 장점을 제공합니다.

  * **문제:** 일반 JPA Criteria API나 JPQL에서는 사용자가 입력한 검색 조건(예: 키워드, 태그, 위치 반경) 중 일부만 들어왔을 때, `if-else` 문을 복잡하게 사용하거나 여러 개의 JPQL 문자열을 만들어야 합니다.
  * **QueryDSL의 해결:** QueryDSL은 **`BooleanExpression`**이라는 객체를 사용하여 검색 조건을 조립합니다. 각 조건이 있을 때만 해당 `BooleanExpression`을 생성하고, 최종적으로 이들을 `.where()` 절에 **Chain** 형태로 연결하여 실행합니다. 이를 통해 조건이 붙거나 빠지는 복잡한 쿼리를 **매우 깔끔하고 직관적으로** 작성할 수 있습니다.

<!-- end list -->

```java
// QueryDSL을 사용한 동적 쿼리 (예시)
BooleanExpression condition = study.isRecruiting.eq(true);

if (keyword != null) {
    condition = condition.and(study.title.contains(keyword));
}
if (tagId != null) {
    condition = condition.and(studyTag.tag.tagId.eq(tagId));
}

// 최종 쿼리 실행 시 모든 조건이 깔끔하게 적용됨
queryFactory.selectFrom(study).where(condition).fetch();
```

-----

## 3\. 📝 코드의 가독성 및 유지보수성

QueryDSL 문법은 SQL 문법과 매우 유사하게 설계되어 있습니다.

  * **직관성:** `select()`, `from()`, `where()`, `join()`, `groupBy()`, `having()` 등의 메서드 체이닝 구조를 사용하기 때문에, 일반적인 SQL 작성 경험이 있는 개발자에게 코드가 직관적으로 읽힙니다.
  * **유지보수:** 복잡한 쿼리 로직이 문자열 대신 객체로 관리되므로, 나중에 쿼리의 일부를 수정하거나 기능을 추가할 때 훨씬 안정적이고 빠르게 대응할 수 있습니다.

결론적으로, QueryDSL은 대규모 서비스에서 **복잡한 쿼리 로직**을 **안정적**이고 **효율적**으로 개발하기 위한 최고의 선택지입니다. 스터디 프로젝트에서 계획하고 계신 **PostGIS 통합 검색**과 **다중 조건 복합 검색** 기능을 구현할 때 핵심적인 역할을 할 것입니다.

# 예시
PostgreSQL의 PostGIS 함수를 **QueryDSL**과 연동하는 핵심은 \*\*`Expressions.numberTemplate`\*\*을 사용하여 PostGIS 함수를 **Native SQL**로 직접 호출하는 것입니다.

QueryDSL은 기본적으로 모든 PostGIS 함수를 알고 있지 않기 때문에, 이 템플릿 방식을 사용해 필요한 함수를 쿼리 빌더에 삽입해야 합니다.

아래는 사용자의 **현재 위치를 기준**으로 **반경 `X` km 이내**의 스터디를 검색하고 **거리순으로 정렬**하는 QueryDSL 예시입니다.

-----

## 1\. DTO 및 상수 정의 (Java/Kotlin)

사용자의 현재 위치와 검색 반경을 전달받는 간단한 DTO와, 좌표계 ID(SRID) 상수를 정의합니다.

```java
// 검색 조건을 담을 DTO
public record LocationSearchRequest(
    double userLatitude,    // 사용자 위도 (Latitude)
    double userLongitude,   // 사용자 경도 (Longitude)
    double radiusKm         // 검색 반경 (킬로미터)
) {}

// PostGIS에서 사용하는 WGS84 좌표계 SRID 상수
public static final int WGS84_SRID = 4326;
```

-----

## 2\. QueryDSL Repository 구현

실제 QueryDSL을 사용하여 위치 기반 검색 로직을 구현하는 부분입니다.

### 2.1. 사용자 위치를 PostGIS GEOGRAPHY 객체로 변환

먼저, 사용자의 위도/경도를 PostGIS가 인식할 수 있는 **`GEOGRAPHY`** 타입의 Point 객체로 만들어야 합니다.

```java
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.NumberExpression;
import com.querydsl.core.types.dsl.StringExpression;

// QStudy는 JPA Entity Study를 QueryDSL로 변환한 객체입니다.
private final QStudy qStudy = QStudy.study; 

public List<Study> searchByLocation(LocationSearchRequest request) {
    
    // 1. 사용자 위치(경도, 위도)를 GEOGRAPHY Point 객체로 생성합니다.
    // QueryDSL의 'template' 기능을 사용하여 SQL 함수를 직접 호출합니다.
    StringExpression targetPoint = Expressions.stringTemplate(
        "ST_SetSRID(ST_MakePoint({0}, {1}), {2})::geography",
        request.userLongitude(), // PostGIS는 경도(Lon)가 먼저 옵니다.
        request.userLatitude(),  // 위도(Lat)
        WGS84_SRID
    );
    
    // 2. 검색 반경을 미터(m)로 변환합니다. (PostGIS ST_DWithin은 m 단위)
    double radiusMeters = request.radiusKm() * 1000.0;
    
    // 3. QueryDSL 빌더를 사용하여 쿼리를 작성합니다.
    return jpaQueryFactory
        .selectFrom(qStudy)
        .where(isWithinDistance(targetPoint, radiusMeters)) // 반경 필터링
        .orderBy(orderByDistance(targetPoint).asc())         // 거리순 정렬
        .fetch();
}
```

-----

### 2.2. PostGIS 함수를 이용한 BooleanExpression 생성 (WHERE 절)

**`ST_DWithin`** 함수를 사용하여 반경 내에 있는 스터디만 필터링하는 `BooleanExpression`을 작성합니다.

```java
/**
 * PostGIS의 ST_DWithin 함수를 호출하여 반경 내 스터디 필터링 조건을 만듭니다.
 * ST_DWithin(GEOGRAPHY 컬럼, 사용자 GEOGRAPHY 객체, 거리(m))
 */
private BooleanExpression isWithinDistance(StringExpression targetPoint, double radiusMeters) {
    // 템플릿의 결과 타입이 boolean이므로 Expressions.booleanTemplate을 사용합니다.
    return Expressions.booleanTemplate(
        "ST_DWithin({0}, {1}, {2})",
        qStudy.location,    // 0: 스터디의 location 컬럼 (GEOGRAPHY)
        targetPoint,        // 1: 사용자의 위치 Point 객체 (GEOGRAPHY)
        radiusMeters        // 2: 검색 반경 (미터 단위)
    );
}
```

-----

### 2.3. PostGIS 함수를 이용한 NumberExpression 생성 (ORDER BY 절)

**`ST_Distance`** 함수를 사용하여 사용자 위치에서 스터디 위치까지의 거리를 계산하고, 이 값으로 정렬 조건을 만듭니다.

```java
/**
 * PostGIS의 ST_Distance 함수를 호출하여 거리를 계산하는 NumberExpression을 만듭니다.
 * ST_Distance(GEOGRAPHY 컬럼, 사용자 GEOGRAPHY 객체) -> 결과는 Double(미터)
 */
private NumberExpression<Double> orderByDistance(StringExpression targetPoint) {
    // 템플릿의 결과 타입이 숫자(Double)이므로 Expressions.numberTemplate을 사용합니다.
    return Expressions.numberTemplate(
        Double.class,
        "ST_Distance({0}, {1})",
        qStudy.location,
        targetPoint
    );
}
```

### ✨ Summary

  * **필터링:** `isWithinDistance` 메서드에서 \*\*`ST_DWithin`\*\*을 사용하며, 이는 **GiST 인덱스**의 도움을 받아 매우 효율적으로 작동합니다.
  * **정렬:** `orderByDistance` 메서드에서 \*\*`ST_Distance`\*\*를 사용해 정확한 거리를 계산하고, \*\*`asc()`\*\*를 붙여 가까운 순으로 정렬합니다.