현재상태 : 2017.7.1:06:10 호스트의 로컬디렉토리를 docker container 와 연결해 놓음
실행방법 : docker run --name myappc -p 3000:3000 -v d:\\mychain:/usr/src/app myapp node server.js
tip : 실행하자마자 바로 죽는 docker container 는 docker inpect {container id} 로 원인조사 가능
