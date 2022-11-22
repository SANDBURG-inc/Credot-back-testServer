const fs = require("fs");

const isIdPwError = async (queryData, res) => {
  return new Promise(async (resolve, reject) => {
    await page.click("#login");
    await page.waitForTimeout(1000);
    let isError = await page.evaluate(() => {
      if (document.querySelector('p[class="input-error-text"]') == null) {
        return false;
      } else {
        return true;
      }
    });
    resolve(isError);
  });
};
const isCorpModal = async () => {
  //사업자 정보등 입력안내 표시모달
  return new Promise(async (resolve, reject) => {
    await page.waitForTimeout(500);
    let isModal = await page.evaluate(() => {
      if (document.querySelector('button[class="button small"]') == null) {
        return false;
      } else {
        return true;
      }
    });
    if (isModal) {
      resolve("필수정보를 입력하고 다시 시도해주세요.");
    }
    resolve();
  });
};

module.exports = {
  isIdPwError,
  isCorpModal,
};
