import { styled } from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
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

const Button = styled.button`
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

const PhotoEditButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SaveButton = styled(Button)`
  background-color: #1d9bf0;
`;

// tweet.tsx는 timeline에서 ITweet 인터페이스를 불러와 인자로 받는다
export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {
  const user = auth.currentUser;
  const [isEditMod, setEdittingMod] = useState(false);
  // 트윗을 수정할 상태 추가
  const [editedTweet, setEditedTweet] = useState(tweet);
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
  // 누르면 수정 모드로 바뀜
  const onEdit = async () => {
    if (user?.uid !== userId) return;
    setEdittingMod(true);
  };
  // 누르면 수정모드 취소
  const onCancel = async () => {
    setEdittingMod(false);
  };
  // 누르면 트윗이 업데이트 됨
  const onSave = async () => {
    // 유저가 맞는지 먼저 확이
    if (user?.uid !== userId) return;
    try {
      // 유저 아이디가 일치하는 선에서 먼저 문서 레퍼런스를 불러옴
      const docRef = doc(db, "tweets", id);
      // 삭제 후 생성하려 했으나 업데이트라는 좋은 함수가 있음
      await updateDoc(docRef, { tweet: editedTweet });
      // 수정을 마친 뒤엔 수정모드를 끔
      setEdittingMod(false);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        <Payload>
          {isEditMod ? (
            <>
              <input
                type="text"
                // useState를 사용해 실시간으로 값을 변화시킴
                value={editedTweet}
                // 체인지 이벤트가 useState에 변화된 내용을 전달
                onChange={(e) => setEditedTweet(e.target.value)}
              ></input>
            </>
          ) : (
            <>{tweet}</>
          )}
        </Payload>
        {user?.uid === userId ? (
          <>
            <Button onClick={onDelete}>Delete</Button>
            {isEditMod ? (
              <>
                <Button onClick={onCancel}>Cancel</Button>
                <SaveButton onClick={onSave}>Save</SaveButton>
              </>
            ) : (
              <Button onClick={onEdit}>Edit</Button>
            )}
          </>
        ) : null}
      </Column>
      {photo ? (
        <>
          <Column>
            <Photo src={photo} />
            <Column>
              {isEditMod ? (
                <PhotoEditButton> Edit Photo </PhotoEditButton>
              ) : null}
            </Column>
          </Column>
        </>
      ) : null}
    </Wrapper>
  );
}
