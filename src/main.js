var getButton;
var reflectionCards = [];
var reflectionCardIds = [];
var commentCards = [];
var members = new Object();

document.addEventListener("DOMContentLoaded", () => {
  window.Trello.authorize({
    type: 'popup',
    name: 'Getting Started Application',
    scope: {
      read: 'true',
      write: 'true' },
    expiration: 'never',
    success: authenticationSuccess,
    error: authenticationFailure
  });
  getButton = document.getElementById("getCards");
});

let authenticationSuccess = function() {
  console.log('Successful authentication');
};

let authenticationFailure = function() {
  console.log('Failed authentication');
};

let getCards = () => {
  console.log("Getting cards...");
  getButton.classList.add("loading");
  getButton.removeAttribute("onclick");
  getButton.innerHTML = "loading...";
  window.Trello.get('boards/G7BJhQRb/cards/', 
  data => {
    data.forEach(card => {
      // card.url instead of card.name so I don't have to deal with capitalisation
      card.url.includes("reflection") ? (reflectionCardIds.push(card.id), reflectionCards.push(card)) : '';
    });
    console.log("Success!");
    getCommentCards();
  },
  error => {
    console.log(error);
  }
  );
}

let getCommentCards = () => {
  console.log("Getting comments from cards...");
  const promises = reflectionCardIds.map(cardId => new Promise((resolve, reject) => {
    window.Trello.get(`cards/${cardId}/actions?filter=commentCard`,
    commentCard => {
      commentCards.push(commentCard);
      resolve(commentCard);
    },
    error => {
      console.log(error);
      reject(error);
    })
  }))
  Promise.all(promises).then(results => {
    console.log("Success!");
    commentCards = commentCards.filter(arr => arr.length);
    sortIntoMembers();
  })
}

let removeEmptyArrs = () => {
  commentCards = commentCards.filter(arr => arr.length);
}

let sortIntoMembers = () => {
  console.log("Populating DOM...");
  commentCards.forEach(commentArr => {
    commentArr.forEach(commentObj => {
      // data.text, date, id, idMemberCreator
      let memberId = commentObj.idMemberCreator;
      let comment = {
        id: commentObj.id,
        date: commentObj.date,
        text: commentObj.data.text
      }
      if (members[`${memberId}`]) {
        members[`${memberId}`].comments.push(comment);
      } else {
        let member = {
          id: memberId,
          fullName: commentObj.memberCreator.fullName,
          userName: commentObj.memberCreator.username,
          comments: []
        }
        members[`${memberId}`] = new Object();
        Object.assign(members[`${memberId}`], member);
        members[`${memberId}`].comments.push(comment);
      }
    })
  })
  let list = document.getElementById("list");
  for (let [member, obj] of Object.entries(members)) {
    let newUL = document.createElement("ul");
    let newH2 = document.createElement("h2");
    let memberNameText = document.createTextNode(`${obj.fullName}`); 
    newH2.appendChild(memberNameText);
    newUL.appendChild(newH2);
    list.appendChild(newUL);

    obj.comments.forEach(comment => {
      let newLI = document.createElement("li");
      let text = document.createTextNode(comment.text);
      newLI.append(text);
      newUL.append(newLI);
    })
  }
  console.log("Success!");
  getButton.classList.remove("loading");
  getButton.setAttribute("onclick", "getCards()");
  getButton.innerHTML = "Get";
}