folderName = "CHECKMARKS";
var isFirefox = typeof InstallTrigger !== "undefined";

chrome.contextMenus.create({
  id: "some-command",

  title: "Save checkpoint",
  contexts: ["video"],
});

function youtube_parser(url) {
  var regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  var match = url.match(regExp);
  return match && match[7].length == 11 ? match[7] : false;
}

async function createBookMark(ele, title, url) {
  console.log("isfirefox", isFirefox);
  let children = ele.children;

  if (children) {
    let c = 0;
    await children.forEach((element, index) => {
      c = c + 1;
      if (element.title == title) {
        chrome.bookmarks.remove(element.id);
      }
    });
  }

  chrome.bookmarks.create({
    parentId: ele.id,
    index: 0,
    title: title,
    url: url,
  });
}

function doStuffWithDom(x, y) {
  if (!x) {
    return;
  }

  _parentId = isFirefox ? "toolbar_____" : "1";

  let u = youtube_parser(x.url);

  var bookmarkTreeNodes = chrome.bookmarks.getTree(function (
    bookmarkTreeNodes
  ) {
    try {
      let bb = [];

      if (isFirefox) {
        bookmarkTreeNodes[0].children.forEach((each_one) => {
          if (each_one.id == "toolbar_____") {
            bb = each_one.children;
          }
        });
      } else {
        bb = bookmarkTreeNodes[0].children[0].children;
      }

      let hasIt = false;

      bb.forEach((element) => {
        if (element.title == folderName) {
          hasIt = element;
        }
      });

      if (!hasIt) {
        chrome.bookmarks.create(
          { parentId: _parentId, title: folderName },
          function (newFolder) {
            createBookMark(
              newFolder,
              y.title,
              "https://www.youtube.com/watch?v=" +
                u +
                "&t=" +
                Math.floor(x.time)
            );
          }
        );
      } else {
        createBookMark(
          hasIt,
          y.title,
          "https://www.youtube.com/watch?v=" + u + "&t=" + Math.floor(x.time)
        );
      }
    } catch {}
  });
}

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  chrome.tabs.sendMessage(
    tab.id,
    { text: "report_back", action: "getDOM" },
    function (response) {
      doStuffWithDom(response, tab);
    }
  );
});
