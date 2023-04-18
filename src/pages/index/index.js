require('./index.less');
require('../../assets/style/normalize.less');
require('../../../config/pagesFolder.js');

// console.log(window.pagesFolder);
(() => {
  // 生成多入口页面链接
  const pagesFolderErgodic = () => {
    const { pagesFolder } = window;
    // 将页面循环遍历至页面内
    const $pageListContainer = document.querySelector('#pageListContainer');
    pagesFolder &&
      pagesFolder.forEach((page) => {
        const $li = document.createElement('li');
        $li.textContent = page;
        $li.addEventListener(
          'click',
          function () {
            location.href = `${location.origin}/${page}`;
          },
          false
        );
        $pageListContainer.appendChild($li);
      });
  };
  pagesFolderErgodic();
})();
