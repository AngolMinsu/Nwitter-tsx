import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { db } from "../firebase";
import { Unsubscribe } from "firebase/auth";
import Tweet from "./tweet";

export interface ITweet {
  id: string;
  photo?: string;
  tweet: string;
  userId: string;
  username: string;
  createdAt: number;
}

const Wrapper = styled.div`
  display: flext;
  gap: 10px;
  flect-direction: column;
`;

// firebase db를 쿼리함
export default function Timeline() {
  const [tweets, setTweet] = useState<ITweet[]>([]);

  // useEffect를 사용하여 함수를 호출함
  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchTweets = async () => {
      const tweetsQuery = query(
        collection(db, "tweets"),
        orderBy("createAt", "desc"),
        limit(25) // pagenation
      );
      // onSnapshot는 실시간으로 쿼리의 변경사항을 확인할 수 있음
      // 또한 유저가 타임라인을 보고있을 때엔 비용을 지불하지 않도록 변수로 만듬
      unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
        const tweets = snapshot.docs.map((doc) => {
          const { tweet, createdAt, userId, username, photo } = doc.data();
          return {
            tweet,
            createdAt,
            userId,
            username,
            photo,
            id: doc.id,
          };
        });
        setTweet(tweets);
      });
    };
    fetchTweets();
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);
  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
}
