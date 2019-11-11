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
});

var reflectionCards = [];
var reflectionCardIds = [];
var commentCards = [];
var members = new Object();

let authenticationSuccess = function() {
  console.log('Successful authentication');
};

let authenticationFailure = function() {
  console.log('Failed authentication');
};

let getCards = () => {
  window.Trello.get('boards/G7BJhQRb/cards/', 
  data => {
    data.forEach(card => {
      // card.url instead of card.name so I don't have to deal with capitalisation
      card.url.includes("reflection") ? (reflectionCardIds.push(card.id), reflectionCards.push(card)) : '';
    });
    console.log(reflectionCards);
  },
  error => {
    console.log(error);
  }
  );
}

let getCommentCards = () => {
  reflectionCardIds.forEach(cardId => {
    window.Trello.get(`cards/${cardId}/actions?filter=commentCard`,
    commentCard => {
      commentCards.push(commentCard);
    },
    error => {
      console.log(error);
    })
  })
}

let removeEmptyArrs = () => {
  console.log(commentCards.length);
  commentCards = commentCards.filter(arr => arr.length);
  console.log(commentCards.length);
}

let sortIntoMembers = () => {
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
  console.log(members);
  let list = document.getElementById("list");
  for (let [member, obj] of Object.entries(members)) {
    // console.log(`${key}: ${value}`);
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
}