import { styled } from "styled-components";
import { auth, db, storage } from "../firebase";
import { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { ITweet } from "../components/timeline";
import Tweet from "../components/tweet";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;
const AvatarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
  }
`;

const AvatarImg = styled.img`
  width: 100%;
`;
const AvatarInput = styled.input`
  display: none;
`;
const Name = styled.span`
  display: grid;
  font-size: 22px;
`;

const Tweets = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
`;

const EditButton = styled.button`
  padding: 5px 10px;
  background-color: #1d9bf0;
  border-radius: 5px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #2980b9;
    color: #ffffff;
  }
`;

const NamingBlank = styled.input`
  background-color: #202020;
  font-size: 22px;
  text-align: center;
  color: white;
  border: 1px none;
  outline: none;
  border-radius: 5px;
  &:focus {
    background-color: #404040;
  }
`;

export default function Profile() {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const [name, setName] = useState(user?.displayName ?? "Anonymous");
  const [editMode, setEditMode] = useState(false);
  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!user) return;
    if (files && files.length === 1) {
      const file = files[0];
      const locationRef = ref(storage, `avatars/${user?.uid}`);
      const result = await uploadBytes(locationRef, file);
      const avatarUrl = await getDownloadURL(result.ref);
      setAvatar(avatarUrl);
      await updateProfile(user, {
        photoURL: avatarUrl,
      });
    }
  };

  // tweets들의 timeline을 가져올 때 쓰는 것과 유사
  const fetchTweets = async () => {
    // 먼저 쿼리 생성
    const tweetQuery = query(
      // 컬렉션을 불러온다
      collection(db, "tweets"),
      // where함수는 필터링 기능. 조건에 맞는 트윗만 가져올 것
      // 문서의 필드, 연산자, 조건
      where("userId", "==", user?.uid),
      // 정렬
      orderBy("createAt", "desc"),
      // 이렇게 데이터를 필터링 하고싶다면 firestore에게 미리 해당 정보를 주어야함
      // 먼저 쿼리를 날린 후 콘솔에서 설정창 링크를 확인할 수 있음
      limit(25)
    );
    // 생성한 쿼리를 기반으로 문서를 가져옴
    const snapshot = await getDocs(tweetQuery);
    const tweets = snapshot.docs.map((doc) => {
      const { tweet, createAt, userId, username, photo } = doc.data();
      return {
        tweet,
        createAt,
        userId,
        username,
        photo,
        id: doc.id,
      };
    });
    setTweets(tweets);
  };
  // 리얼타임이 아니므로 바로 함수를 실행시켜 줄 것
  useEffect(() => {
    fetchTweets();
  }, []);

  const onChangeNameClick = async () => {
    if (!user) return;
    setEditMode((prev) => !prev);
    if (!editMode) return;
    try {
      await updateProfile(user, {
        displayName: name,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setEditMode(false);
    }
  };

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setName(event.target.value);

  return (
    <Wrapper>
      <AvatarUpload htmlFor="avatar">
        {avatar ? (
          <AvatarImg src={avatar} />
        ) : (
          <svg
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
          </svg>
        )}
      </AvatarUpload>
      <AvatarInput
        onChange={onAvatarChange}
        id="avatar"
        type="file"
        accept="image/*"
      />
      {editMode ? (
        <NamingBlank onChange={onNameChange} type="text" value={name} />
      ) : (
        <Name>{user?.displayName ?? "Anonymous"}</Name>
      )}
      <EditButton onClick={onChangeNameClick}>
        {editMode ? "Save" : "Edit Name"}
      </EditButton>
      <Tweets>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </Tweets>
    </Wrapper>
  );
}
