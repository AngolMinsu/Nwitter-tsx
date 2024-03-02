import styled from "styled-components";
import { auth, storage } from "../firebase";
import React, { useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";

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
  font-size: 22px;
`;

export default function Profile() {
  const user = auth.currentUser;
  // 아바타 속성을 photoURL을 이용해 얻어온다
  const [avatar, setAvatar] = useState(user?.photoURL);
  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!user) return;
    if (files && files.length === 1) {
      const file = files[0];
      // 이렇게 로케이션을 지정해두면 사진을 변경할 때 마다 덮어쓰기가 됨
      const locationRef = ref(storage, `avatars/${user?.uid}`);
      // uploadBytes는 firebase의 지정된 storage위치에 업로드 하는 역할
      const result = await uploadBytes(locationRef, file);
      // 다운로드 URL을 얻어오는 역할
      const avatarUrl = await getDownloadURL(result.ref);
      // state update
      setAvatar(avatarUrl);
      // 사용자의 프로필을 업데이트
      // 인자를 두 개 받는데 1.어느 유저인가(auth.currentuser)
      // 2.어떤 속성을 변경할 것 인가
      await updateProfile(user, { photoURL: avatarUrl });
    }
  };
  // htmlFor에 Input의 id를 넣어두면 연동된다
  return (
    <Wrapper>
      <AvatarUpload htmlFor="avatar">
        {avatar ? (
          <AvatarImg src={avatar} />
        ) : (
          <svg
            data-slot="icon"
            fill="none"
            strokeWidth={1.5}
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
        )}
      </AvatarUpload>
      <AvatarInput
        onChange={onAvatarChange}
        id="avatar"
        type="file"
        accept="image/*"
      />
      <Name>{user?.displayName ?? "Anonymous"}</Name>
    </Wrapper>
  );
}
