import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { styled } from "styled-components";
import { db } from "../firebase";

// 상속받으려고 만든건가
// firebase db 내용을 가져와 객체로 만드는건가
export interface ITweet {
  id: string;
  photo: string; // 사진은 링크로
  tweet: string; // 트윗내용
  userId: string; // 유저 아이디
  username: string; // 유저 이름
  createdAt: number; // 만든 시간
}

const Wrapper = styled.div``;

// firebase db에서 데이터 쿼리하는 방법
// 먼저 트윗을 가져온 다음 UI를 구성할 것
export default function Timeline() {
  // 아직은 ITweet내용을 빈 배열로 가짐
  // 이하 setTweets에서 리턴받은 tweet객체를 ITweet객체에 전달
  const [tweets, setTweets] = useState<ITweet[]>([]);
  // 비동기 함수
  const fetchTweets = async () => {
    try {
      // query는 firebase에서 데이터를 불러오는 것
      const tweetsQuery = query(
        // collection 함수는 firestore와 db의 컬렉션이름을 요구함
        collection(db, "tweets"),
        // 가장 최신순으로 정렬하는 함수
        // 기준은 createdAt이고 내림차순으로 정렬
        orderBy("createdAt", "desc")
      );
      // query를 주면 snapquery를 반환함
      const snapshot = await getDocs(tweetsQuery);
      // 우리가 map으로 받은 모든 문서마다 리턴 이하와 같은 객체를 생성
      const fetchedTweets = snapshot.docs.map((doc) => {
        const { tweet, createdAt, userId, username, photo } = doc.data();
        return { tweet, createdAt, userId, username, photo, id: doc.id };
      });
      // 이렇게 생성된 tweets 객체를 setTweet에 사용
      setTweets(fetchedTweets);
    } catch (error) {
      console.log(error);
    }
  };
  // useEffect를 활용해 fetchTweets를 호출할 것
  useEffect(() => {
    fetchTweets();
  }, []);
  return <Wrapper>{JSON.stringify(tweets)}</Wrapper>;
}
