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
  camera: document.querySelector('.camera'),
};

const employees = new Map();

employees.set(1, 'John');
employees.set(2, 'Hamir');
employees.set(3, 'Rahul');
employees.set(4, 'Xieng');
employees.set(5, 'Jeffrey E.');
employees.set(6, 'Hasan');
employees.set(7, 'George');
employees.set(8, 'Juan');

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    el.modal.classList.add('hidden');
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === '=') {
    handleCalc();
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
  if (val === '=') {
    handleCalc();
    return;
  } else {
    el.display.value += val;
  }
};

const handleCalc = function () {
  el.modal.classList.remove('hidden');
  resetPaymentState();
};

if (el.camera) {
  el.camera._originalInnerHTML = el.camera.innerHTML;
}

(function addCameraStyles() {
  const css = `
.camera { position: relative; display: inline-flex; align-items: center; }
.camera .camera-text { display: inline-block; }
.camera .camera-dot { width: 10px; height: 10px; border-radius: 50%; background: #ff3b30; display: inline-block; margin-right: 8px; vertical-align: middle; opacity: 0; transform: scale(1); transition: opacity .2s, transform .2s; }
.camera.recording .camera-dot { opacity: 1; animation: pulse 1s infinite; }
@keyframes pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.4); opacity: .6; } 100% { transform: scale(1); opacity: 1; } }
`;
  const s = document.createElement('style');
  s.setAttribute('data-generated', 'camera-dot');
  s.textContent = css;
  document.head.appendChild(s);
})();

el.camera.addEventListener('click', () => {
  if (el.camera._cameraTimeouts) {
    el.camera._cameraTimeouts.forEach(t => clearTimeout(t));
  }

  if (el.camera.classList.contains('customized')) {
    if (el.camera._cameraTimeouts) {
      el.camera._cameraTimeouts.forEach(t => clearTimeout(t));
    }
    el.camera.innerHTML = el.camera._originalInnerHTML || '';
    el.camera.classList.remove('customized', 'recording');
    delete el.camera._cameraTimeouts;
    return;
  }

  el.camera.innerHTML =
    '<span class="camera-dot" aria-hidden="true"></span><span class="camera-text">recording...</span>';
  const textEl = el.camera.querySelector('.camera-text');

  el.camera.classList.add('customized', 'recording');
  textEl.textContent = 'recording...';
  setTimeout(() => {
    document.querySelector('.hero-copy').textContent =
      `${employees.get(Math.floor(Math.random() * 8) + 1)} started monitoring the video...`;
  }, 8000);

  setTimeout(() => {
    document.querySelector('.hero-copy').textContent =
      'Recordings are stored securely and used for "internal Purposes" only.';
  }, 30000);

  setTimeout(() => {
    document.querySelector('.hero-copy').textContent =
      'Keep the camera ON a little longer... Almost finished...';
  }, 85000);

  const t1 = setTimeout(() => {
    textEl.textContent = 'Please uncover camera...';
    el.camera.classList.remove('recording');
  }, 2000);

  const t2 = setTimeout(() => {
    textEl.textContent = 'recording...';
    el.camera.classList.add('recording');
  }, 4000);

  el.camera._cameraTimeouts = [t1, t2];
});

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
