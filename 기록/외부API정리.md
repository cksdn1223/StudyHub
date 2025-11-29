# 공간정보오픈플랫폼(V-World)
- baseUrl = https://api.vworld.kr/req/address
## 기본 param
- service=address
- request=getcoord
- simple=true
- format=json
- type=road
## 입력 param
- key=YOUR_API_KEY
- address=도로명주소(공백%20)
## 리턴값
```json
{
  "response": {
    "service": {
      "name": "address",
      "version": "2.0",
      "operation": "getcoord",
      "time": "20(ms)"
    },
    "status": "OK",
    "result": {
      "crs": "EPSG:4326",
      "point": {
        "x": "129.161916618",
        "y": "35.165857929"
      }
    }
  }
}
```
data로 받아온다면 경도 위도
- data.response.result.point.x 경도
- data.response.result.point.y 위도



# 도로명 주소 불러오는 api 호출용 npm 라이브러리
```tsx
import { useDaumPostcodePopup } from 'react-daum-postcode';

function Postcode() {
  const open = useDaumPostcodePopup('https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js');
  const handleComplete = (data:{address: string}) => {
    console.log(data.address); // e.g. '서울 성동구 왕십리로2길 20 (성수동1가)'
  };

  const handleClick = () => {
    open({ onComplete: handleComplete });
  };

  return (
    <button type='button' onClick={handleClick}>
      Open
    </button>
  );
}

export default Postcode;
```
react-daum-postcode 라는 라이브러리를 이용해서 간단하게 도로명 주소를 받아올 수 있었다.
다른 api를 사용해서 시도해보다 어렵고 복잡해서 찾아보았는데 누군가 라이브러리로 만들어 놓아서 쉽게 사용이 가능했다.