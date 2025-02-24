import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [isClicked, setIsClick] = useState(false);
  const [friend, setFriend] = useState(initialFriends);
  const [selectedPerson, isSelectedPerson] = useState(null);

  function handleSelect(person) {
    isSelectedPerson((cur) => (cur?.id === person.id ? null : person));
  }

  function handleButton() {
    setIsClick((e) => !e);
  }
  function handleAdd(f) {
    console.log(f);
    setFriend((fe) => [...fe, f]);
  }
  function handleSplitBill(value) {
    setFriend((prevFriends) =>
      prevFriends.map((i) =>
        i.id === selectedPerson.id ? { ...i, balance: i.balance + value } : i
      )
    );
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friend={friend}
          handleSelect={handleSelect}
          selectedPerson={selectedPerson}
        />
        {isClicked && <AddFriend handleAdd={handleAdd} />}
        <Button onClick={handleButton}>
          {isClicked ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedPerson && (
        <SplitForm
          selectedPerson={selectedPerson}
          handleSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendList({ friend, handleSelect, selectedPerson }) {
  return (
    <div>
      <ul>
        {friend.map((i) => (
          <Friend
            whole={i}
            key={i.id}
            handleSelect={handleSelect}
            selectedPerson={selectedPerson}
          />
        ))}
      </ul>
    </div>
  );
}

function Friend({ whole, handleSelect, selectedPerson }) {
  let isSelected = selectedPerson?.id === whole.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={whole.image} alt={whole.name} />
      <h3>{whole.name}</h3>
      <p
        className={
          whole.balance > 0 ? "green" : whole.balance === 0 ? "" : "red"
        }
      >
        {whole.balance > 0
          ? `${whole.name} owe you $${whole.balance}`
          : whole.balance === 0
          ? `You and ${whole.name} are even`
          : `You owe ${whole.name} $${Math.abs(whole.balance)}`}
      </p>
      <Button onClick={() => handleSelect(whole)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function AddFriend({ handleAdd }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");
  function addFriend(e) {
    e.preventDefault();
    if (name === "" || image === "") return;
    const id = crypto.randomUUID();
    const addedusers = {
      id: id,
      name: name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    handleAdd(addedusers);
    setName("");
    setImage("https://i.pravatar.cc/48");
  }
  return (
    <form className="form-add-friend" onSubmit={addFriend}>
      <label>👨🏼‍🤝‍👩🏻Name </label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>🖼️Image Url</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function SplitForm({ selectedPerson, handleSplitBill }) {
  const [bill, setBill] = useState(0);
  const [userExpense, setUserExpense] = useState(0);
  const [whoPays, setWhoPays] = useState("user");

  let friendExpense = bill - userExpense;

  function handleSplit(e) {
    e.preventDefault();
    if (!bill) return;

    let expense = whoPays === "user" ? friendExpense : -userExpense;
    handleSplitBill(expense);
  }
  return (
    <form className="form-split-bill" onSubmit={handleSplit}>
      <h2>Split bill with {selectedPerson.name}</h2>
      <label>💰 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label>🙎 Your expense </label>
      <input
        type="text"
        value={userExpense}
        onChange={(e) =>
          Number(e.target.value) <= bill
            ? setUserExpense(Number(e.target.value))
            : setUserExpense(0)
        }
      />
      <label>👨🏼‍🤝‍👩🏻 {selectedPerson.name}'s expense</label>
      <input type="text" disabled value={friendExpense} />
      <label>🤑 Who is paying the bill?</label>
      <select value={whoPays} onChange={(e) => setWhoPays(e.target.value)}>
        <option value={"user"}>You</option>
        <option value={"friend"}>{selectedPerson.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
