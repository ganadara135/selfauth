1. 2017.7.1:06:11
현재상태 : 2017.7.1:06:10 호스트의 로컬디렉토리를 docker container 와 연결해 놓음
실행방법 : docker run --name myappc -p 3000:3000 -v d:\\mychain:/usr/src/app myapp node server.js
tip : 실행하자마자 바로 죽는 docker container 는 docker inpect {container id} 로 원인조사 가능

2. 2017.7.3:07:50
tip : docker logs -f { $container id }  실시간으로 터미널에 stdout 함, crtl + c   중지

3. 2017.7.3:17:22
node 웹서버 실싱행 인수로 서버주소 및 체인코어서버 접근토근 넘기게 변경 (웹호팅서버에서)
실행방법 : docker run --name myappc -p 80:3000 myapp node server.js  {체인코어접근토근} {서버주소}
현재체인코어접근토근 : client:515714dbc996904e87f3630f6b83cd16cb8d96fc78fe2d79206e4caa8a194f53
서버주소 : http://220.230.112.30:1999

3. 2017.7.12:16:30
비밀메모장 페이지 추가

4. 2017.7.13
자바스크립트기반 다국어 지원 반영

5. 2017.7.17:18:30
CORS 반영, 비트코인 블랙체인 계정정보 끌어오기 구현
