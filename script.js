"use strict";

// const account1 = {
//     owner: "Jonas Schmedtmann",
//     movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//     interestRate: 1.2, // %
//     pin: 1111,
// };

// const account2 = {
//     owner: "Jessica Davis",
//     movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//     interestRate: 1.5,
//     pin: 2222,
// };

// const account3 = {
//     owner: "Steven Thomas Williams",
//     movements: [200, -200, 340, -300, -20, 50, 400, -460],
//     interestRate: 0.7,
//     pin: 3333,
// };

// const account4 = {
//     owner: "Sarah Smith",
//     movements: [430, 1000, 700, 50, 90],
//     interestRate: 1,
//     pin: 4444,
// };

// const accounts = [account1, account2, account3, account4];

const account1 = {
    owner: "Jonas Schmedtmann",
    movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
    interestRate: 1.2, // %
    pin: 1111,

    movementsDates: [
        "2019-11-18T21:31:17.178Z",
        "2019-12-23T07:42:02.383Z",
        "2020-01-28T09:15:04.904Z",
        "2020-04-01T10:17:24.185Z",
        "2020-05-08T14:11:59.604Z",
        "2020-05-27T17:01:17.194Z",
        "2020-07-11T23:36:17.929Z",
        "2020-07-12T10:51:36.790Z",
    ],
    currency: "EUR",
    locale: "pt-PT", // de-DE
};

const account2 = {
    owner: "Jessica Davis",
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,

    movementsDates: [
        "2019-11-01T13:15:33.035Z",
        "2019-11-30T09:48:16.867Z",
        "2019-12-25T06:04:23.907Z",
        "2020-01-25T14:18:46.235Z",
        "2020-02-05T16:33:06.386Z",
        "2020-04-10T14:43:26.374Z",
        "2020-06-25T18:49:59.371Z",
        "2020-07-26T12:01:20.894Z",
    ],
    currency: "USD",
    locale: "en-US",
};

const accounts = [account1, account2];

//-----------------------------------------//
//Getting Dom Elements
//----------------------------------------//
const transactionDetailsBox = document.querySelector(".transactions-details");
const totalAccountBalance = document.querySelector(".balance-amt");
const loginText = document.querySelector(".login-text");
const loginBtn = document.getElementById("login-btn");
const totalDeposits = document.querySelector(".amt-in");
const totalWithdrawals = document.querySelector(".amt-out");
const totalInterest = document.querySelector(".amt-int");
const sortItems = document.querySelector(".sort");
const accountUser = document.getElementById("login-name");
const accountUserPin = document.getElementById("login-pin");
const transferAmount = document.querySelector(".transfer-amount");
const recipientCust = document.querySelector(".bank-code");
const transferBtn = document.querySelector(".transfer-btn");
const accDetailsContainer = document.querySelector(".details-container");
const requestedLoan = document.querySelector(".loan-amount");
const requestLoanBtn = document.querySelector(".btn-loan");
const closeAccountUsername = document.querySelector(".close-acc");
const closeAccountUserpin = document.querySelector(".close-user-pin");
const closeAccountBtn = document.querySelector(".btn-close-acc");
const mainDate = document.querySelector(".date-today .date");
const mainTime = document.querySelector(".date-today .time");
const transactDate = document.querySelector(".trn-date");
const logOutTimer = document.querySelector(".timer");
const registerBtn = document.getElementById("button-register");
const firstNameEl = document.getElementById("firstname");
const lastNameEl = document.getElementById("lastname");
const setPinEl = document.getElementById("set-pin");
const selectedCurrEl = document.getElementById("selected-curr");
const selectedCountryEl = document.getElementById("selected-country");
const registrationEl = document.querySelector(".register");

const listAccounts = [];
const getData = (first, last, pin, curr, country) => {
    if (
        !first.trim() ||
        !last.trim() ||
        !pin.trim() ||
        !curr.trim() ||
        !country.trim()
    ) {
        console.log(`recheck your details`);
        return;
    }

    const newAccount = {
        owner: `${first[0].toUpperCase() + first.slice(1).toLowerCase()} ${
            last[0].toUpperCase() + last.slice(1).toLowerCase()
        }`,
        firstname: first,
        movements: [],
        interestRate: 1.2,
        pin: parseInt(pin),
        movementsDates: [],
        currency: curr,
        locale: country,
        createUserNames() {
            this.username = this.owner
                .toLowerCase()
                .split(" ")
                .map((name) => {
                    return name.at(0);
                })
                .join("");
        },
    };
    newAccount.createUserNames();
    console.log(newAccount);
    listAccounts.push(newAccount);
    accounts.push(newAccount);
    console.log(accounts);
    console.log(listAccounts);
    firstNameEl.value =
        lastNameEl.value =
        setPinEl.value =
        selectedCurrEl.value =
        selectedCountryEl.value =
            "";
};

registerBtn.addEventListener("click", (e) => {
    e.preventDefault();
    getData(
        firstNameEl.value,
        lastNameEl.value,
        setPinEl.value,
        selectedCurrEl.value,
        selectedCountryEl.value
    );
});

//----------------------------------------------//
//Adding username, first name to the account object
//----------------------------------------------//
const createUserNames = (accounts) => {
    accounts.forEach((acc, idx) => {
        acc.username = acc.owner
            .toLowerCase()
            .split(" ")
            .map((name) => {
                return name.at(0);
            })
            .join("");
        acc.firstname = acc.owner.toLowerCase().split(" ")[0];
    });
};
createUserNames(accounts);

//----------------------------------------------//
//Format number
//----------------------------------------------//
const formatNumbers = (user, number) => {
    return new Intl.NumberFormat(user.locale, {
        style: "currency",
        currency: user.currency,
    }).format(number);
};

//--------------------------------------------------//
//Insert all transactions to the DOM
//-------------------------------------------------//
const displayTransactions = (currUser, sort = false) => {
    transactionDetailsBox.innerHTML = "";

    const sortedMovements = sort
        ? currUser.movements.slice().sort((a, b) => a - b)
        : currUser.movements;

    sortedMovements.forEach((movement, idx, arr) => {
        const type = movement > 0 ? "deposit" : "withdrawal";

        const trnDate = new Date(currUser.movementsDates[idx]);

        const trnDateFinal2 = new Date(
            trnDate.getFullYear(),
            trnDate.getMonth(),
            trnDate.getDate()
        );
        const transactionDays = calcDays(trnDateFinal2, new Date());

        const transaction = `
            <div class="transaction">
                <div class="trn">
                    <p class="trn-details trn-details-${type}">
                        <span class="trn-count">${idx + 1}</span>${type}
                    </p>
                    <p class="trn-date">${transactionDays}</p>
                </div>
                <p class="trn-amount">
                    <span class="amount">${formatNumbers(
                        currUser,
                        movement
                    )}</span>
                </p>
            </div>
        `;
        transactionDetailsBox.insertAdjacentHTML("afterbegin", transaction);
    });
};

//--------------------------------------------------//
//Total balance, total deposits, total withdrawals
//-------------------------------------------------//
const displayAccountData = (currUser) => {
    //total account balance
    const totalBalance = currUser.movements.reduce((prevNum, currNum) => {
        return prevNum + currNum;
    }, 0);
    totalAccountBalance.textContent = formatNumbers(currUser, totalBalance);
    currUser.accountBalance = totalBalance;

    //cash deposits
    const deposit = currUser.movements
        .filter((mov) => mov > 0)
        .reduce((prevNum, currNum) => {
            return prevNum + currNum;
        }, 0);
    totalDeposits.textContent = formatNumbers(currUser, deposit);

    //Cash withdrawals
    const outflows = currUser.movements
        .filter((mov) => mov < 0)
        .reduce((prevNum, currNum) => {
            return prevNum + currNum;
        }, 0);
    totalWithdrawals.textContent = formatNumbers(
        currUser,
        Math.trunc(Math.abs(outflows))
    );

    //interest paid on each deposit only if inst is equal or greater than 1
    const intrest = currUser.movements
        .filter((mov) => mov > 0)
        .map((mov) => mov * (currUser.interestRate / 100))
        .filter((mov) => mov >= 1)
        .reduce((prevnum, currnum) => prevnum + currnum, 0);
    totalInterest.textContent = formatNumbers(currUser, Math.trunc(intrest));
};

//--------------------------------------------------//
//User inactivity timeout handler
//-------------------------------------------------//
const timeOutHandler = () => {
    //set overall time
    let time = 600;

    //fiunction handling logout timer
    const tick = function () {
        const min = String(Math.trunc(time / 60)).padStart(2, 0);
        const sec = String(time % 60).padStart(2, 0);
        logOutTimer.textContent = `${min}:${sec}`;
        time--;
        if (time == 0) {
            clearInterval(timeOutHandler);
            loginText.textContent = `Login to get started`;
            accDetailsContainer.style.display = `none`;
        }
    };
    tick(); //call the tick fuction immediately

    const timer = setInterval(tick, 1000); //call the tick fuction after 1 second

    return timer;
};

//----------------------------------------------//
//Login
//----------------------------------------------//
let loggedInUser, timer;
//const locale = navigator.language; //finding location of user to format dates correctly

const login = (accs) => {
    const user = accountUser.value.toLowerCase();
    const userPin = parseInt(accountUserPin.value);

    if (user && userPin) {
        //find logged in user account
        loggedInUser = accs.find(
            (acc) => acc.pin === userPin && acc.username === user
        );

        //format current login time and date
        setInterval(function () {
            const currentDate = new Date();
            mainDate.textContent = new Intl.DateTimeFormat(
                loggedInUser.locale
            ).format(currentDate);
            mainTime.textContent = new Intl.DateTimeFormat(
                loggedInUser.locale,
                {
                    timeStyle: "medium",
                }
            ).format(currentDate);
        }, 1000);

        //call timer
        if (timer) clearInterval(timer);
        timer = timeOutHandler();

        //allow the display of logged in user account details and transaction
        registrationEl.style.display = `none`;
        accDetailsContainer.style.display = `flex`;
        displayAccountData(loggedInUser);
        displayTransactions(loggedInUser);

        //format login welcome text
        loginText.textContent = `Welcome, ${loggedInUser.firstname}`;

        //Clear the input fields of the login area
        accountUser.value = "";
        accountUserPin.value = "";
    } else {
        console.log(`${user} and ${userPin} are invalid`);
    }
};

loginBtn.addEventListener("click", () => {
    login(accounts);
});

//----------------------------------------------//
//Transfer funds
//----------------------------------------------//
const transfer = (accs, currUser) => {
    const receiver = recipientCust.value.toLowerCase();
    const transferAmt = parseInt(transferAmount.value);
    const recipient = accs.find((acc) => acc.username === receiver);
    console.log(recipient);

    if (currUser) {
        if (
            transferAmt > 0 &&
            transferAmt < currUser.accountBalance &&
            recipient?.username !== currUser.username //?. optional chaining will first check if recipient is true then check the other condition
        ) {
            if (recipient) {
                currUser.movements.push(-transferAmt);
                currUser.movementsDates.push(new Date());
            }
            recipient.movements.push(transferAmt);
            recipient.movementsDates.push(new Date());
            displayAccountData(currUser);
            displayTransactions(currUser);
        }
    }
    recipientCust.value = transferAmount.value = "";

    //RESET TIMOUT
    clearInterval(timer);
    timer = timeOutHandler();
};

transferBtn.addEventListener("click", () => {
    transfer(accounts, loggedInUser);
});

//----------------------------------------------//
//Sorting transactions, transfering funds
//----------------------------------------------//
let sorted = false;
sortItems.addEventListener("click", () => {
    if (loggedInUser) {
        displayTransactions(loggedInUser, !sorted);
        sorted = !sorted;
    }
});

//----------------------------------------------//
//Sorting transactions, transfering funds
//----------------------------------------------//
const applyLoan = (currUser) => {
    const loanAmt = parseInt(requestedLoan.value);

    if (currUser) {
        if (
            loanAmt > 0 &&
            currUser.movements.some((mov) => mov >= loanAmt / 10)
        ) {
            setTimeout(function () {
                currUser.movements.push(loanAmt);
                currUser.movementsDates.push(new Date());
                displayAccountData(currUser);
                displayTransactions(currUser);
            }, 5000);
        } else {
            console.log(`${loanAmt} is not a number`);
        }
    }

    requestedLoan.value = "";

    //RESET TIMOUT
    clearInterval(timer);
    timer = timeOutHandler();
};
requestLoanBtn.addEventListener("click", () => {
    applyLoan(loggedInUser);
});

//----------------------------------------------//
//Close Account - applying findIndex method
//----------------------------------------------//
const closeAccount = (currUser, accs) => {
    const user = closeAccountUsername.value;
    const pin = parseInt(closeAccountUserpin.value);
    if (currUser?.username === user && currUser?.pin === pin) {
        //?. optional chaining
        const accIdx = accs.findIndex(
            (acc) =>
                acc.username === closeAccountUsername.value &&
                acc.pin === parseInt(closeAccountUserpin.value)
        );
        accs.splice(accIdx, 1);
    }
    closeAccountUsername.value = closeAccountUserpin.value = "";
    accDetailsContainer.style.display = `none`;
};
closeAccountBtn.addEventListener("click", () => {
    closeAccount(loggedInUser, accounts);
});

//----------------------------------------------//
//Managing the dates of transactions
//----------------------------------------------//
function calcDays(date1, date2) {
    let daysPassed = Math.trunc((date2 - date1) / (1000 * 60 * 60 * 24)); //converting milliseconds to days
    if (daysPassed === 0) return `Today`;
    if (daysPassed === 1) return `Yesterday`;
    if (daysPassed <= 7) return `${daysPassed} days ago`;
    return new Intl.DateTimeFormat(loggedInUser.locale).format(date1);
}
