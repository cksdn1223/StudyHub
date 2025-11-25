# PostgreSQL 및 PostGIS
[참고 링크](https://foss4g.tistory.com/1859)

링크 설명대로 설치

[데이터베이스 생성](https://foss4g.tistory.com/1860)

링크 참고해 데이터베이스 생성

---
## 사용 이유
**PostgreSQL에 PostGIS 확장을 사용하면, 복잡한 거리 계산 로직을 개발자가 애플리케이션(Spring Boot) 코드 내에서 짤 필요 없이 SQL 문 하나로 데이터베이스에게 맡길 수 있습니다.**

이것이 바로 PostGIS를 도입하는 가장 큰 이유이자 이점입니다.

-----

## 1\. ⚙️ 데이터베이스가 처리하는 로직

Spring Boot 서버는 다음과 같은 정보를 데이터베이스에 전달합니다.

1.  **기준 위치:** 사용자(검색자)의 경도 및 위도 좌표.
2.  **검색 반경:** 찾고 싶은 거리 (예: 5,000m 또는 5km).

데이터베이스는 이 정보를 받아서 PostGIS의 전용 함수를 사용해 검색을 처리합니다.

### 핵심 PostGIS 함수: `ST_DWithin`

스터디 목록을 검색할 때 사용하는 핵심적인 SQL 함수는 `ST_DWithin`입니다.

```sql
SELECT *
FROM Study
WHERE ST_DWithin(
    Study.geom,            -- 스터디의 위치 데이터 (DB에 저장된 좌표)
    ST_SetSRID(ST_MakePoint(:user_lon, :user_lat), 4326), -- 사용자 현재 위치
    :radius_in_meters      -- 검색 반경 (단위: 미터)
);
```

이 함수는 다음 두 가지 역할을 동시에 수행합니다.

1.  **거리 계산:** 지구의 곡률을 고려하여 `Study.geom`과 사용자의 위치 사이의 **정확한 실제 거리**를 계산합니다.
2.  **조건 필터링:** 계산된 거리가 `:radius_in_meters` 내에 포함되는지 확인하고, 해당 스터디만 즉시 반환합니다.

이 모든 복잡한 계산은 PostgreSQL의 \*\*공간 인덱스(Spatial Index)\*\*를 통해 초고속으로 처리됩니다.

## 2\. 💻 Spring Boot의 역할

Spring Boot 백엔드 개발자(Service Layer)의 역할은 이제 **계산 로직을 짜는 것**이 아니라, **SQL 쿼리를 안전하고 효율적으로 만드는 것**으로 바뀝니다.

  * **[QueryDSL](QueryDSL.md) 사용:** Spring Boot Service에서 사용자의 검색 파라미터(위도, 경도, 반경)를 받아 **QueryDSL**로 위 SQL을 추상화하여 안전하게 호출합니다.
  * **데이터 변환:** 클라이언트가 전달한 위도/경도(문자열/숫자)를 DB가 이해할 수 있는 좌표 타입으로 변환하여 쿼리에 바인딩합니다.

결론적으로, 로직은 **SQL 문장 하나**로 끝납니다. 개발자는 복잡한 수학 공식 대신 DB의 강력한 기능을 활용하는 데 집중할 수 있습니다.








-----
# 예시

## 1\. 스터디 테이블 및 위치 컬럼 생성

아래 SQL은 스터디 정보를 저장할 `study` 테이블을 생성합니다. 핵심은 위치 정보를 저장하는 **`location`** 컬럼입니다.

```sql
-- 1. PostGIS 확장 활성화 확인 (최초 1회만 실행)
-- 만약 아직 확장을 설치하지 않았다면 이 명령을 먼저 실행해야 합니다.
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. study 테이블 생성
CREATE TABLE study (
    study_id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    max_capacity INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'RECRUITING',
    -- === PostGIS 핵심 컬럼 ===
    -- GEOGRAPHY(Point, 4326) 타입으로 설정:
    --   - GEOGRAPHY: 지구 곡률을 반영하여 정확한 거리 계산 보장.
    --   - Point: 스터디 위치는 하나의 점(경도/위도)으로 표현.
    --   - 4326: WGS84 좌표계 (GPS 표준) SRID.
    location GEOGRAPHY(Point, 4326),
    -- =========================
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

-----

## 2\. 공간 검색을 위한 GiST 인덱스 생성 (필수)

`location` 컬럼을 사용하여 "반경 X km 이내" 검색을 할 때 속도 저하를 막기 위해 **공간 인덱스**를 생성해야 합니다. PostGIS에서 가장 많이 사용되는 공간 인덱스는 **GiST (Generalized Search Tree)** 인덱스입니다.

```sql
-- GiST 공간 인덱스를 location 컬럼에 생성하여 검색 성능을 최적화합니다.
CREATE INDEX idx_study_location ON study USING GIST (location);
```

### 💡 왜 GiST 인덱스가 필요한가요?

일반적인 B-Tree 인덱스는 단순 값(숫자, 문자열)의 비교에는 빠르지만, 2차원 공간 상의 \*\*'인접성(Nearness)'\*\*을 찾는 작업에는 비효율적입니다. GiST 인덱스는 공간 데이터를 효율적으로 관리하고, 특히 `ST_DWithin`과 같은 **거리 기반 쿼리**를 실행할 때 엄청난 속도 향상을 가져옵니다.

-----

## 3\. 더미 데이터 삽입 및 확인

테스트를 위해 스터디 데이터를 하나 삽입해 보겠습니다.

```sql
-- 예시: 'StudyHub Backend' 스터디를 서울 강남역 근처에 생성 (경도: 127.0276, 위도: 37.4981)

INSERT INTO study (title, description, max_capacity, location)
VALUES (
    'StudyHub 백엔드 개발 스터디', 
    'Spring Boot와 PostGIS를 활용한 웹 서비스 개발', 
    5,
    -- ST_SetSRID(ST_MakePoint(경도, 위도), SRID)
    ST_SetSRID(ST_MakePoint(127.0276, 37.4981), 4326)::geography
);
```

-----

## 4\. 핵심 기능: 위치 기반 검색 쿼리 (반경 검색)

이제 사용자의 현재 위치를 기준으로 **반경 5km 이내**에 있는 스터디를 찾는 쿼리입니다. 이 쿼리가 바로 프로젝트의 핵심 기능입니다.

```sql
-- 사용자 위치: 서울대학교 입구 (경도: 126.9537, 위도: 37.4784)
-- 검색 반경: 5000m (5km)

SELECT 
    study_id,
    title,
    -- 사용자 위치와 스터디 위치 간의 거리를 미터(m)로 계산
    ST_Distance(
        location, 
        ST_SetSRID(ST_MakePoint(126.9537, 37.4784), 4326)::geography
    ) AS distance_meters
FROM 
    study
WHERE 
    -- ST_DWithin: 스터디 위치(location)가 사용자 위치로부터 5000m(5km) 이내인지 확인
    ST_DWithin(
        location, 
        ST_SetSRID(ST_MakePoint(126.9537, 37.4784), 4326)::geography, 
        5000 -- 거리는 항상 미터(m) 단위로 입력해야 합니다.
    )
ORDER BY 
    distance_meters;
```

이 쿼리는 GiST 인덱스를 사용하여 매우 빠르게 5km 이내의 스터디 목록을 찾고, 거리 순으로 정렬하여 반환합니다. 이 구조를 **Spring Boot의 QueryDSL**로 변환하여 API를 구현