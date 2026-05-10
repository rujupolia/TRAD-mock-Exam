function loadQuestions(){

  // ONLINE
  if(navigator.onLine){

    fetch(GOOGLE_SCRIPT_URL)

      .then(r => r.json())

      .then(data => {

        // SAVE QUESTIONS OFFLINE
        localStorage.setItem(
          "cachedQuestions",
          JSON.stringify(data)
        );

        shuffle(data);

        questions = data.slice(0,110);

        renderQuestions();
      })

      .catch(() => {

        loadOfflineQuestions();
      });

  }else{

    loadOfflineQuestions();
  }
}

function loadOfflineQuestions(){

  let cached =
    localStorage.getItem("cachedQuestions");

  if(!cached){

    alert(
      "No offline questions available yet.\n\n" +
      "Please connect to internet first."
    );

    return;
  }

  let data = JSON.parse(cached);

  shuffle(data);

  questions = data.slice(0,110);

  renderQuestions();

  alert("Offline Mode Enabled");
}