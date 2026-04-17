const STORAGE_KEY = "talk-through-time-state-v2";

const starterDecks = [
  { id: "royal-court-vs-group-chat", name: "👑 Royal Court vs Group Chat", createdAt: Date.now() - 6000 },
  { id: "savage-comebacks", name: "⚡ Savage Comebacks", createdAt: Date.now() - 5000 },
  { id: "love-and-heartbreak", name: "💔 Love & Heartbreak", createdAt: Date.now() - 4000 },
  { id: "insults", name: "🗡 Insults", createdAt: Date.now() - 3000 },
  { id: "confidence-and-bragging", name: "🏆 Confidence & Bragging", createdAt: Date.now() - 2000 },
  { id: "excuses", name: "⏰ Excuses", createdAt: Date.now() - 1000 },
];

const starterCardsByDeckId = {
  "royal-court-vs-group-chat": [
    { id: "rcgc-1", front: "That's Cap", back: "My lord, thou speaketh falsehoods most boldly", updatedAt: Date.now() },
    { id: "rcgc-2", front: "Say less", back: "Restrain thy tongue, for thy message hath already reached mine understanding", updatedAt: Date.now() },
    { id: "rcgc-3", front: "Where you at", back: "Reveal thy current whereabouts, lest I assume thou art lost to the wilderness", updatedAt: Date.now() },
    { id: "rcgc-6", front: "We outside this weekend", back: "This weekend, we shall depart the halls and make our presence known unto the realm", updatedAt: Date.now() },
    { id: "rcgc-7", front: "Get yo money up, not yo funny up", back: "Improve thy coin before attempting jest in my presence", updatedAt: Date.now() },
  ],
  "savage-comebacks": [
    { id: "sc-1", front: "You are not relevant", back: "Thy presence holds no consequence in this realm", updatedAt: Date.now() },
    { id: "sc-2", front: "You thought you ate", back: "Thou hast accomplished naught worthy of praise", updatedAt: Date.now() },
    { id: "sc-3", front: "You are not even on my level", back: "Thou standeth far beneath my station", updatedAt: Date.now() },
    { id: "sc-6", front: "Who is this guy", back: "Pray tell, who hath allowed this unknown peasant to speak?", updatedAt: Date.now() },
    { id: "sc-7", front: "You sound smart when you not speaking", back: "Thou appearest wisest when thy mouth remaineth shut", updatedAt: Date.now() },
  ],
  "love-and-heartbreak": [
    { id: "lh-1", front: "You played me", back: "Thou hast made sport of my affection", updatedAt: Date.now() },
    { id: "lh-2", front: "I'm over it", back: "My heart hath released its hold upon thee", updatedAt: Date.now() },
    { id: "lh-3", front: "We're done", back: "Let this be the end of our union", updatedAt: Date.now() },
    { id: "lh-6", front: "I need you real bad", back: "My soul yearneth for thee with unreasonable urgency", updatedAt: Date.now() },
    { id: "lh-7", front: "Stop playing, you know you want me", back: "Cease thy games, for thy heart already inclineth toward me", updatedAt: Date.now() },
  ],
  insults: [
    { id: "ins-1", front: "You're slow", back: "Thou art not swift of mind", updatedAt: Date.now() },
    { id: "ins-2", front: "You're embarrassing yourself", back: "Thou hast become a spectacle of thine own making", updatedAt: Date.now() },
    { id: "ins-3", front: "That was weak", back: "A most feeble display, unworthy of note", updatedAt: Date.now() },
    { id: "ins-6", front: "You broke", back: "Thy purse is emptier than thy promises", updatedAt: Date.now() },
    { id: "ins-7", front: "I'm jealous of everyone you never met", back: "I envy all souls fortunate enough to have never crossed paths with thee", updatedAt: Date.now() },
  ],
  "confidence-and-bragging": [
    { id: "cb-1", front: "I'm him", back: "I am that individual of whom legends dare whisper", updatedAt: Date.now() },
    { id: "cb-2", front: "I don't miss", back: "Failure and I are but distant acquaintances", updatedAt: Date.now() },
    { id: "cb-3", front: "I'm built different", back: "I am fashioned in a manner unlike any other soul in this realm", updatedAt: Date.now() },
    { id: "cb-6", front: "When you google perfection, a picture of me pops up", back: "Seek perfection in the grand archives, and mine portrait shall appear", updatedAt: Date.now() },
    { id: "cb-7", front: "You need a page out of my book", back: "Thou wouldst prosper greatly by studying but one page of my wisdom", updatedAt: Date.now() },
  ],
  excuses: [
    { id: "ex-1", front: "My alarm did not go off", back: "Fate conspired against my timely arrival", updatedAt: Date.now() },
    { id: "ex-2", front: "I didn't see it", back: "It escaped mine notice entirely", updatedAt: Date.now() },
    { id: "ex-3", front: "I was sleep", back: "Slumber held me captive beyond my control", updatedAt: Date.now() },
    { id: "ex-6", front: "I wasn't feeling good", back: "My body was engaged in rebellion against me", updatedAt: Date.now() },
    { id: "ex-7", front: "My phone died", back: "Mine communication device hath breathed its final breath", updatedAt: Date.now() },
  ],
};

function createDefaultState() {
  return {
    decks: structuredClone(starterDecks),
    cardsByDeckId: structuredClone(starterCardsByDeckId),
    activeDeckId: starterDecks[0].id,
    activeCardIndex: 0,
    isShowingFront: true,
    searchTerm: "",
    ui: {
      activeModal: null,
      editingDeckId: null,
      editingCardId: null,
      lastFocusedElement: null,
    },
  };
}

function loadState() {
  try {
    const savedState = localStorage.getItem(STORAGE_KEY);

    if (!savedState) {
      return createDefaultState();
    }

    const parsedState = JSON.parse(savedState);

    if (
      !parsedState ||
      !Array.isArray(parsedState.decks) ||
      typeof parsedState.cardsByDeckId !== "object"
    ) {
      return createDefaultState();
    }

    return {
      ...createDefaultState(),
      ...parsedState,
      ui: {
        activeModal: null,
        editingDeckId: null,
        editingCardId: null,
        lastFocusedElement: null,
      },
    };
  } catch (error) {
    console.error("Unable to load saved state.", error);
    return createDefaultState();
  }
}

const appState = loadState();

const deckList = document.getElementById("deck-list");
const deckTitle = document.getElementById("deck-title");
const deckDescription = document.getElementById("deck-description");
const cardCount = document.getElementById("card-count");
const flashcard = document.getElementById("flashcard");
const cardFrontText = document.getElementById("card-front-text");
const cardBackText = document.getElementById("card-back-text");
const searchInput = document.getElementById("search-input");
const liveStatus = document.getElementById("live-status");

const previousButton = document.getElementById("previous-button");
const flipButton = document.getElementById("flip-button");
const nextButton = document.getElementById("next-button");
const shuffleButton = document.getElementById("shuffle-button");
const newDeckButton = document.getElementById("new-deck-button");
const editDeckButton = document.getElementById("edit-deck-button");
const deleteDeckButton = document.getElementById("delete-deck-button");
const newCardButton = document.getElementById("new-card-button");
const editCardButton = document.getElementById("edit-card-button");
const deleteCardButton = document.getElementById("delete-card-button");

const modalOverlay = document.getElementById("modal-overlay");

const deckModal = document.getElementById("deck-modal");
const deckForm = document.getElementById("deck-form");
const deckNameInput = document.getElementById("deck-name-input");
const deckFormError = document.getElementById("deck-form-error");
const deckModalTitle = document.getElementById("deck-modal-title");
const closeDeckModalButton = document.getElementById("close-deck-modal");
const cancelDeckButton = document.getElementById("cancel-deck-button");

const cardModal = document.getElementById("card-modal");
const cardForm = document.getElementById("card-form");
const cardFrontInput = document.getElementById("card-front-input");
const cardBackInput = document.getElementById("card-back-input");
const cardFormError = document.getElementById("card-form-error");
const cardModalTitle = document.getElementById("card-modal-title");
const closeCardModalButton = document.getElementById("close-card-modal");
const cancelCardButton = document.getElementById("cancel-card-button");

function saveState() {
  const stateToSave = {
    decks: appState.decks,
    cardsByDeckId: appState.cardsByDeckId,
    activeDeckId: appState.activeDeckId,
    activeCardIndex: appState.activeCardIndex,
    isShowingFront: appState.isShowingFront,
    searchTerm: appState.searchTerm,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
}

function createId(prefix) {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

function announceStatus(message) {
  liveStatus.textContent = message;
}

function getActiveDeck() {
  return appState.decks.find((deck) => deck.id === appState.activeDeckId) || null;
}

function getActiveCards() {
  return appState.cardsByDeckId[appState.activeDeckId] || [];
}

function getFilteredCards() {
  const cards = getActiveCards();
  const search = appState.searchTerm.trim().toLowerCase();

  if (!search) {
    return cards;
  }

  return cards.filter((card) => {
    return (
      card.front.toLowerCase().includes(search) ||
      card.back.toLowerCase().includes(search)
    );
  });
}

function getActiveCard() {
  const filteredCards = getFilteredCards();
  return filteredCards[appState.activeCardIndex] || null;
}

function ensureValidState() {
  if (appState.decks.length === 0) {
    appState.activeDeckId = null;
    appState.activeCardIndex = 0;
    appState.isShowingFront = true;
    return;
  }

  const deckStillExists = appState.decks.some(
    (deck) => deck.id === appState.activeDeckId
  );

  if (!deckStillExists) {
    appState.activeDeckId = appState.decks[0].id;
  }

  const filteredCards = getFilteredCards();

  if (filteredCards.length === 0) {
    appState.activeCardIndex = 0;
    appState.isShowingFront = true;
    return;
  }

  if (appState.activeCardIndex >= filteredCards.length) {
    appState.activeCardIndex = 0;
  }

  if (appState.activeCardIndex < 0) {
    appState.activeCardIndex = filteredCards.length - 1;
  }
}

function animateCardChange(callback) {
  flashcard.classList.add("card-switching");

  window.setTimeout(() => {
    callback();
    flashcard.classList.remove("card-switching");
  }, 140);
}

function renderDeckList() {
  deckList.innerHTML = "";

  if (appState.decks.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.innerHTML = `
      <p class="empty-deck-message mb-0">
        No decks yet. Tap <strong>New Deck</strong> to start your time-travel collection.
      </p>
    `;
    deckList.appendChild(emptyItem);
    return;
  }

  appState.decks.forEach((deck) => {
    const listItem = document.createElement("li");
    const deckButton = document.createElement("button");

    deckButton.type = "button";
    deckButton.className = "deck-button";

    if (deck.id === appState.activeDeckId) {
      deckButton.classList.add("active-deck");
    }

    deckButton.textContent = deck.name;
    deckButton.setAttribute(
      "aria-pressed",
      String(deck.id === appState.activeDeckId)
    );

    deckButton.addEventListener("click", () => {
      appState.activeDeckId = deck.id;
      appState.activeCardIndex = 0;
      appState.isShowingFront = true;
      appState.searchTerm = "";
      searchInput.value = "";
      saveState();
      renderApp();
      announceStatus(`${deck.name} deck selected.`);
    });

    listItem.appendChild(deckButton);
    deckList.appendChild(listItem);
  });
}

function renderActiveDeck() {
  const activeDeck = getActiveDeck();

  if (!activeDeck) {
    deckTitle.textContent = "No deck selected";
    deckDescription.textContent =
      "Create a deck to begin your linguistic time travel.";
    editDeckButton.disabled = true;
    deleteDeckButton.disabled = true;
    newCardButton.disabled = true;
    editCardButton.disabled = true;
    deleteCardButton.disabled = true;
    return;
  }

  deckTitle.textContent = activeDeck.name;
  deckDescription.textContent =
    "Translate today's slang into language fit for the ages.";

  editDeckButton.disabled = false;
  deleteDeckButton.disabled = false;
  newCardButton.disabled = false;

  const hasCard = Boolean(getActiveCard());
  editCardButton.disabled = !hasCard;
  deleteCardButton.disabled = !hasCard;
}

function renderCardCount() {
  const totalCards = getActiveCards().length;
  const filteredCards = getFilteredCards();

  if (!getActiveDeck()) {
    cardCount.textContent = "No deck selected";
    return;
  }

  if (appState.searchTerm.trim()) {
    cardCount.textContent = `Showing ${filteredCards.length} of ${totalCards} cards`;
    return;
  }

  cardCount.textContent = `Showing ${totalCards} cards`;
}

function renderActiveCard() {
  const activeDeck = getActiveDeck();
  const activeCard = getActiveCard();

  flashcard.classList.toggle("is-flipped", !appState.isShowingFront);

  if (!activeDeck) {
    cardFrontText.textContent = "Create a deck, then add cards to begin.";
    cardBackText.textContent = "Your classic side will appear here once cards exist.";
    editCardButton.disabled = true;
    deleteCardButton.disabled = true;
    return;
  }

  if (!activeCard) {
    cardFrontText.textContent = appState.searchTerm.trim()
      ? "No cards match this search."
      : "No cards yet. Press New Card to add your first phrase.";
    cardBackText.textContent = "The classic translation will appear here.";
    editCardButton.disabled = true;
    deleteCardButton.disabled = true;
    return;
  }

  editCardButton.disabled = false;
  deleteCardButton.disabled = false;

  cardFrontText.textContent = activeCard.front;
  cardBackText.textContent = activeCard.back;
}

function renderApp() {
  ensureValidState();
  renderDeckList();
  renderActiveDeck();
  renderCardCount();
  renderActiveCard();
}

function showNextCard() {
  const filteredCards = getFilteredCards();

  if (filteredCards.length === 0) {
    return;
  }

  animateCardChange(() => {
    appState.activeCardIndex += 1;

    if (appState.activeCardIndex >= filteredCards.length) {
      appState.activeCardIndex = 0;
    }

    appState.isShowingFront = true;
    saveState();
    renderActiveCard();
  });
}

function showPreviousCard() {
  const filteredCards = getFilteredCards();

  if (filteredCards.length === 0) {
    return;
  }

  animateCardChange(() => {
    appState.activeCardIndex -= 1;

    if (appState.activeCardIndex < 0) {
      appState.activeCardIndex = filteredCards.length - 1;
    }

    appState.isShowingFront = true;
    saveState();
    renderActiveCard();
  });
}

function flipCard() {
  if (!getActiveCard()) {
    return;
  }

  appState.isShowingFront = !appState.isShowingFront;
  saveState();
  renderActiveCard();
  announceStatus(`Showing ${appState.isShowingFront ? "modern" : "classic"} side.`);
}

function shuffleCards() {
  const cards = getActiveCards();

  if (cards.length <= 1) {
    return;
  }

  for (let index = cards.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [cards[index], cards[randomIndex]] = [cards[randomIndex], cards[index]];
  }

  appState.activeCardIndex = 0;
  appState.isShowingFront = true;
  saveState();
  renderApp();
  announceStatus("Cards shuffled.");
}

function handleSearchInput(event) {
  appState.searchTerm = event.target.value;
  appState.activeCardIndex = 0;
  appState.isShowingFront = true;
  saveState();
  renderApp();
}

function openModal(modalType, opener) {
  appState.ui.activeModal = modalType;
  appState.ui.lastFocusedElement = opener || document.activeElement;

  modalOverlay.classList.remove("hidden");

  if (modalType === "deck") {
    deckModal.classList.remove("hidden");
    deckNameInput.focus();
  }

  if (modalType === "card") {
    cardModal.classList.remove("hidden");
    cardFrontInput.focus();
  }

  document.body.style.overflow = "hidden";
}

function closeModals() {
  appState.ui.activeModal = null;
  appState.ui.editingDeckId = null;
  appState.ui.editingCardId = null;

  deckModal.classList.add("hidden");
  cardModal.classList.add("hidden");
  modalOverlay.classList.add("hidden");

  deckForm.reset();
  cardForm.reset();
  deckFormError.textContent = "";
  cardFormError.textContent = "";

  document.body.style.overflow = "";

  if (appState.ui.lastFocusedElement) {
    appState.ui.lastFocusedElement.focus();
  }
}

function openNewDeckModal() {
  deckModalTitle.textContent = "New Deck";
  deckNameInput.value = "";
  deckFormError.textContent = "";
  appState.ui.editingDeckId = null;
  openModal("deck", newDeckButton);
}

function openEditDeckModal() {
  const activeDeck = getActiveDeck();

  if (!activeDeck) {
    return;
  }

  deckModalTitle.textContent = "Edit Deck";
  deckNameInput.value = activeDeck.name;
  deckFormError.textContent = "";
  appState.ui.editingDeckId = activeDeck.id;
  openModal("deck", editDeckButton);
}

function openNewCardModal() {
  if (!getActiveDeck()) {
    return;
  }

  cardModalTitle.textContent = "New Card";
  cardFrontInput.value = "";
  cardBackInput.value = "";
  cardFormError.textContent = "";
  appState.ui.editingCardId = null;
  openModal("card", newCardButton);
}

function openEditCardModal() {
  const activeCard = getActiveCard();

  if (!activeCard) {
    return;
  }

  cardModalTitle.textContent = "Edit Card";
  cardFrontInput.value = activeCard.front;
  cardBackInput.value = activeCard.back;
  cardFormError.textContent = "";
  appState.ui.editingCardId = activeCard.id;
  openModal("card", editCardButton);
}

function handleDeckFormSubmit(event) {
  event.preventDefault();

  const deckName = deckNameInput.value.trim();

  if (!deckName) {
    deckFormError.textContent = "Deck name cannot be empty.";
    deckNameInput.focus();
    return;
  }

  const duplicateDeck = appState.decks.find((deck) => {
    return (
      deck.name.toLowerCase() === deckName.toLowerCase() &&
      deck.id !== appState.ui.editingDeckId
    );
  });

  if (duplicateDeck) {
    deckFormError.textContent = "A deck with that name already exists.";
    deckNameInput.focus();
    return;
  }

  if (appState.ui.editingDeckId) {
    const deckToUpdate = appState.decks.find(
      (deck) => deck.id === appState.ui.editingDeckId
    );

    if (deckToUpdate) {
      deckToUpdate.name = deckName;
      announceStatus("Deck updated.");
    }
  } else {
    const newDeckId = createId("deck");

    appState.decks.push({
      id: newDeckId,
      name: deckName,
      createdAt: Date.now(),
    });

    appState.cardsByDeckId[newDeckId] = [];
    appState.activeDeckId = newDeckId;
    appState.activeCardIndex = 0;
    appState.isShowingFront = true;
    appState.searchTerm = "";
    searchInput.value = "";
    announceStatus("New deck created.");
  }

  saveState();
  closeModals();
  renderApp();
}

function handleCardFormSubmit(event) {
  event.preventDefault();

  const frontText = cardFrontInput.value.trim();
  const backText = cardBackInput.value.trim();

  if (!frontText || !backText) {
    cardFormError.textContent = "Both sides of the card are required.";
    if (!frontText) {
      cardFrontInput.focus();
    } else {
      cardBackInput.focus();
    }
    return;
  }

  const cards = getActiveCards();

  if (appState.ui.editingCardId) {
    const cardToUpdate = cards.find((card) => card.id === appState.ui.editingCardId);

    if (cardToUpdate) {
      cardToUpdate.front = frontText;
      cardToUpdate.back = backText;
      cardToUpdate.updatedAt = Date.now();

      const filteredCards = getFilteredCards();
      const currentIndex = filteredCards.findIndex((card) => card.id === cardToUpdate.id);

      if (currentIndex >= 0) {
        appState.activeCardIndex = currentIndex;
      }

      announceStatus("Card updated.");
    }
  } else {
    const newCard = {
      id: createId("card"),
      front: frontText,
      back: backText,
      updatedAt: Date.now(),
    };

    cards.push(newCard);
    appState.activeCardIndex = cards.length - 1;
    appState.isShowingFront = true;
    announceStatus("New card created.");
  }

  saveState();
  closeModals();
  renderApp();
}

function deleteActiveDeck() {
  const activeDeck = getActiveDeck();

  if (!activeDeck) {
    return;
  }

  const confirmed = window.confirm(`Delete the deck "${activeDeck.name}"?`);

  if (!confirmed) {
    return;
  }

  appState.decks = appState.decks.filter((deck) => deck.id !== activeDeck.id);
  delete appState.cardsByDeckId[activeDeck.id];

  if (appState.decks.length > 0) {
    appState.activeDeckId = appState.decks[0].id;
  } else {
    appState.activeDeckId = null;
  }

  appState.activeCardIndex = 0;
  appState.isShowingFront = true;
  appState.searchTerm = "";
  searchInput.value = "";

  saveState();
  renderApp();
  announceStatus("Deck deleted.");
}

function deleteActiveCard() {
  const activeCard = getActiveCard();
  const activeDeck = getActiveDeck();

  if (!activeCard || !activeDeck) {
    return;
  }

  const confirmed = window.confirm(`Delete this card from "${activeDeck.name}"?`);

  if (!confirmed) {
    return;
  }

  const cards = getActiveCards();
  const cardIndex = cards.findIndex((card) => card.id === activeCard.id);

  if (cardIndex >= 0) {
    cards.splice(cardIndex, 1);
  }

  appState.activeCardIndex = 0;
  appState.isShowingFront = true;

  saveState();
  renderApp();
  announceStatus("Card deleted.");
}

function handleGlobalKeydown(event) {
  if (appState.ui.activeModal) {
    if (event.key === "Escape") {
      closeModals();
    }

    return;
  }

  const tagName = document.activeElement.tagName;

  if (
    tagName === "INPUT" ||
    tagName === "TEXTAREA" ||
    document.activeElement.isContentEditable
  ) {
    return;
  }

  if (event.key === " ") {
    event.preventDefault();
    flipCard();
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    showNextCard();
  }

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    showPreviousCard();
  }
}

function trapFocus(event) {
  if (!appState.ui.activeModal || event.key !== "Tab") {
    return;
  }

  const activeModal = appState.ui.activeModal === "deck" ? deckModal : cardModal;
  const focusableElements = activeModal.querySelectorAll(
    'button, input, textarea, [href], [tabindex]:not([tabindex="-1"])'
  );

  if (focusableElements.length === 0) {
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  }

  if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
}

newDeckButton.addEventListener("click", openNewDeckModal);
editDeckButton.addEventListener("click", openEditDeckModal);
deleteDeckButton.addEventListener("click", deleteActiveDeck);

newCardButton.addEventListener("click", openNewCardModal);
editCardButton.addEventListener("click", openEditCardModal);
deleteCardButton.addEventListener("click", deleteActiveCard);

previousButton.addEventListener("click", showPreviousCard);
flipButton.addEventListener("click", flipCard);
nextButton.addEventListener("click", showNextCard);
shuffleButton.addEventListener("click", shuffleCards);
flashcard.addEventListener("click", flipCard);
searchInput.addEventListener("input", handleSearchInput);

deckForm.addEventListener("submit", handleDeckFormSubmit);
cardForm.addEventListener("submit", handleCardFormSubmit);

closeDeckModalButton.addEventListener("click", closeModals);
cancelDeckButton.addEventListener("click", closeModals);
closeCardModalButton.addEventListener("click", closeModals);
cancelCardButton.addEventListener("click", closeModals);
modalOverlay.addEventListener("click", closeModals);

document.addEventListener("keydown", handleGlobalKeydown);
document.addEventListener("keydown", trapFocus);

renderApp();