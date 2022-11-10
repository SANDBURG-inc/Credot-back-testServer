const isIdPwError = async (queryData) => {
  const update = async () => {
    error = true;
  };
  const returnData = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(error);
      }, 1000);
    });
  };
  const tmon_id = queryData.id;
  const tmon_pw = queryData.pw;

  await page.goto("https://spc.tmon.co.kr/member/login");

  await page.evaluate(
    (id, pw) => {
      document.querySelector('input[id="form_id"]').value = id;
      document.querySelector('input[id="form_password"]').value = pw;
    },
    tmon_id,
    tmon_pw
  );

  await page.click('button[class="btn submit"]');
  await page.on("dialog", async (dialog) => {
    console.log(dialog.message());
    if (dialog.message() == "아이디 또는 비밀번호가 올바르지 않습니다.") {
      await update();
      console.log("로그인 실패");
      await dialog.accept();
    }
    if (
      dialog.message() ==
      "입점서류가 등록되어 있지 않습니다. 확인 버튼 클릭 시 파트너 정보관리 화면으로 이동합니다."
    ) {
      console.log("입점서류가 아직등록되지 않음 login OK");
      await dialog.accept();
    }
  });
  return returnData();
};

module.exports = {
  isIdPwError,
};
