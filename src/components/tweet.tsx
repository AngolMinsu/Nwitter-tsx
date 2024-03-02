import { styled } from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import EditTweetForm from "./edit-tweet-form";
import { useState } from "react";
const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div``;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

// 삭제 버튼
const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  margin-right: 5px;
`;

const EditButton = styled.button`
  background-color: #1d9bf0;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  margin-right: 5px;
`;

// tweet.tsx는 timeline에서 ITweet 인터페이스를 불러와 인자로 받는다
export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {
  const user = auth.currentUser;
  const [isEditing, setIsEditting] = useState(false);
  const onDelete = async () => {
    const ok = confirm("Are you sure you want to delete this tweet?");
    if (!ok || user?.uid !== userId) return;
    try {
      // deleteDoc은 doc을 찾아서 지워주는 역할을 한다.
      // 먼저 doc 함수로 문서를 불러온다
      // 이 때 doc함수는 firebase db와 저장된 위치명, 그리고 id를 인자로 받는다
      await deleteDoc(doc(db, "tweets", id));
      // 만약 트윗에 사진이 포함되어 있다면 사진을 지우는 역할을 할 것
      if (photo) {
        // 먼저 ref로 firebase 스토리지에 저장된 위치에서 사진을 참조 변수로 받는다
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        // 비동기 함수를 사용해 객체를 지운다.
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onEdit = async () => {
    setIsEditting((prev) => !prev);
  };

  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        {isEditing ? (
          <EditTweetForm
            tweet={tweet}
            id={id}
            userId={userId}
            username={username}
            createdAt={0}
          ></EditTweetForm>
        ) : (
          <Payload>{tweet}</Payload>
        )}
        {user?.uid === userId ? (
          <>
            <DeleteButton onClick={onDelete}>Delete</DeleteButton>
            <EditButton onClick={onEdit}>
              {isEditing === true ? "Cancel" : "Edit"}
            </EditButton>
          </>
        ) : null}
      </Column>
      {photo ? (
        <Column>
          <Photo src={photo} />
        </Column>
      ) : null}
    </Wrapper>
  );
}
