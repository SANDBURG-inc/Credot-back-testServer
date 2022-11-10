const isIdPwError = async (queryData, idpwError) => {
  if (queryData.id && queryData.pw) {
    const tmon_id = queryData.id;
    const tmon_pw = queryData.pw;

    await page.goto("https://spc.tmon.co.kr/member/login");

    await page.evaluate(
      (id, pw) => {
        document.querySelector('input[id="form_id"]').value = id;
        document.querySelector('input[name="form_password"]').value = pw;
      },
      tmon_id,
      tmon_pw
    );

    //로그인
    await page.click('button[class="btn submit"]');

    page.on("dialog", async (dialog) => {
      const isDialog = await dialog.dismiss();
      return new Promise(function (resolve, reject) {
        resolve(isDialog);
      });
    });

    console.log("idpwError:" + idpwError);
    return idpwError;
  }
  return false;
};

module.exports = {
  isIdPwError,
};
