const el = {
  display: document.querySelector('input[name="display"]'),
  buttons: document.querySelectorAll('input[type="button"]'),
  modal: document.querySelector('#payment'),
  paid: document.querySelector('.payment-button'),
  paymentStatus: document.querySelector('#paymentStatus'),
  paymentContent: document.querySelector('.payment-content'),
  paymentForm: document.querySelector('.payment-form'),
  paymentStatusTitle: document.querySelector('.payment-status-title'),
  paymentStatusCopy: document.querySelector('.payment-status-copy'),
  ccNumber: document.getElementById('cc'),
  expireDate: document.getElementById('expire-date'),
  cvvCode: document.getElementById('cvv'),
};

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    el.modal.classList.add('hidden');
  }
});

const resetPaymentState = function () {
  el.paid.disabled = false;
  el.paymentContent.classList.remove('hidden');
  el.paymentForm.classList.remove('hidden');
  el.paymentStatus.classList.add('hidden');
  el.paymentStatus.classList.remove('success');
  el.paymentStatusTitle.textContent = 'Processing payment';
  el.paymentStatusCopy.textContent =
    'Hang tight while we process your transaction...';
};

el.ccNumber.addEventListener('input', e => {
  let formatted = e.target.value
    .replace(/\s?/g, '')
    .match(/.{1,4}/g)
    ?.join(' ');
  el.ccNumber.value = formatted ? formatted.substring(0, 19) : '';
});

el.expireDate.addEventListener('input', e => {
  if (e.target.value.length > 3) {
    let formattedDate =
      e.target.value.substring(0, 2) + '/' + e.target.value.substring(2, 4);
    el.expireDate.value = formattedDate;
  }
});

el.paid.addEventListener('click', () => {
  if (
    !el.ccNumber.value ||
    el.ccNumber.value.length !== 19 ||
    !el.expireDate.value ||
    !el.cvvCode.value
  ) {
    alert('Enter a valid credit card number');
    return;
  }

  const userInput = el.display.value;

  let result;
  try {
    result = Function('return ' + userInput)();
  } catch (error) {
    alert('Unable to calculate result. Please check your input.');
    return;
  }

  el.paymentContent.classList.add('hidden');
  el.paymentForm.classList.add('hidden');
  el.paymentStatus.classList.remove('hidden');
  el.paymentStatusTitle.textContent = 'Processing payment...';
  el.paymentStatusCopy.textContent =
    'Hang tight while we process your transaction...';
  el.paid.disabled = true;

  setTimeout(() => {
    el.paymentStatus.classList.add('success');
    el.paymentStatusTitle.textContent = 'Payment successful!';
    el.paymentStatusCopy.textContent =
      'Your payment is complete. Revealing the result now.';

    setTimeout(() => {
      el.modal.classList.add('hidden');
      el.display.value = result;
      resetPaymentState();
    }, 2200);
  }, 2900);
  el.ccNumber.value = '';
  el.expireDate.value = '';
  el.cvvCode.value = '';
});

const clearDisplay = function () {
  el.display.value = '';
};

const deleteOne = function () {
  el.display.value = el.display.value.toString().slice(0, -1);
};

const appendToDisplay = function (val) {
  el.display.value += val;
};

const handleCalc = function () {
  el.modal.classList.remove('hidden');
  resetPaymentState();
};

el.buttons.forEach(button =>
  button.addEventListener('click', () => {
    const value = button.value;

    if (value === '=') {
      handleCalc();
    } else if (value === 'AC') {
      clearDisplay();
    } else if (value === 'DE') {
      deleteOne();
    } else {
      appendToDisplay(value);
    }
  }),
);
