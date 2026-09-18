 console.log('testando')
const diagram = document.querySelector('main');
const firstAddButton = document.querySelector('.add-step');
const initialSignalInput = document.getElementById('inputSignal');
const initialSignalLabel = document.querySelector('label[for="inputSignal"]');
const signalTitleRow = document.querySelector('.signal-title-row');
const signalTitle = document.querySelector('.signal-title');
const signalValue = document.querySelector('.signal-value');
const editSignalButton = document.querySelector('.edit-signal');
let ctoCount = 0;

const balancedLosses = {
	'1x2': 3.7,
	'1x4': 7.1,
	'1x8': 10.5,
	'1x16': 13.7
};

const unbalancedLosses = {
	'2/98': [18.7, 0.4],
	'5/95': [14.6, 0.5],
	'10/90': [11.0, 0.7],
	'15/85': [9.6, 1.0],
	'20/80': [7.9, 1.4],
	'25/75': [6.95, 1.7],
	'30/70': [6.0, 1.9],
	'35/65': [5.35, 2.3],
	'40/60': [4.7, 2.7],
	'45/55': [4.15, 3.15],
	'50/50': [3.7, 3.7]
};

function validateInitialSignal(showMessage = false) {
	initialSignalInput.setCustomValidity(
		initialSignalInput.value.trim() ? '' : 'Informe o sinal inicial.'
	);

	const isValid = initialSignalInput.value.trim() && initialSignalInput.checkValidity();
	initialSignalInput.classList.toggle('is-valid', Boolean(isValid));
	initialSignalInput.classList.toggle('is-invalid', !isValid);

	if (showMessage && !isValid) {
		initialSignalInput.reportValidity();
	}

	return Boolean(isValid);
}

function addCtoNode(event) {
	const clickedButton = event.currentTarget;
	const branch = clickedButton.closest('.diagram-branch');
	if (!branch) {
		return;
	}

	if (!validateInitialSignal() || signalTitleRow.hidden) {
		if (!initialSignalInput.checkValidity()) {
			initialSignalInput.reportValidity();
		}
		return;
	}

	clickedButton.remove();

	const inputSignal = Number(branch.dataset.inputSignal);
	const ctoNode = createCtoNode(inputSignal);
	const ctoRow = document.createElement('div');
	ctoRow.className = 'cto-row';
	ctoRow.append(ctoNode);

	const nextBranch = createVerticalBranch();

	diagram.append(ctoRow, nextBranch);
	ctoNode.querySelectorAll('select').forEach((select) => select.dispatchEvent(new Event('change')));
}

function commitInitialSignal() {
	const value = initialSignalInput.value.trim();
	signalTitle.textContent = 'Sinal Inicial';
	signalValue.textContent = `${value} dBm`;
	initialSignalInput.hidden = true;
	initialSignalLabel.hidden = true;
	signalTitleRow.hidden = false;

	const firstBranch = document.querySelector('.diagram-branch');
	if (firstBranch) {
		firstBranch.dataset.inputSignal = Number(value);
	}

	const firstCtoSignal = document.querySelector('.cto-node .cto-signal');
	if (firstCtoSignal) {
		firstCtoSignal.textContent = `Sinal de entrada: ${value} dBm`;
		const firstCto = firstCtoSignal.closest('.cto-node');
		firstCto.dataset.inputSignal = Number(value);
		firstCto.querySelectorAll('select').forEach((select) => select.dispatchEvent(new Event('change')));
	}
}

function editInitialSignal() {
	signalTitleRow.hidden = true;
	initialSignalLabel.hidden = false;
	initialSignalInput.hidden = false;
	initialSignalInput.focus();
	initialSignalInput.select();
}

function createSelect(id, values) {
	const select = document.createElement('select');
	select.id = id;
	select.className = 'splitter-select';
	values.forEach((value) => {
		const option = document.createElement('option');
		option.value = value;
		option.textContent = value;
		select.append(option);
	});
	return select;
}

function createRemoveButton(label) {
	const button = document.createElement('button');
	button.className = 'remove-splitter';
	button.type = 'button';
	button.textContent = '\u00d7';
	button.setAttribute('aria-label', label);
	return button;
}

function createCtoNode(inputSignal, isDerived = false) {
	ctoCount += 1;

	const ctoNode = document.createElement('div');
	ctoNode.className = 'cto-node';
	ctoNode.dataset.inputSignal = inputSignal;
	ctoNode.dataset.splitterCount = '1';

	const ctoTitleRow = document.createElement('div');
	ctoTitleRow.className = 'cto-title-row';

	const ctoTitle = document.createElement('h2');
	ctoTitle.className = 'cto-title';
	ctoTitle.textContent = `CTO ${ctoCount}`;

	const editButton = document.createElement('button');
	editButton.className = 'edit-cto';
	editButton.type = 'button';
	editButton.setAttribute('aria-label', 'Editar nome da CTO');
	editButton.title = 'Editar nome';
	editButton.textContent = '\u270e';

	const ctoLabel = document.createElement('label');
	ctoLabel.textContent = 'Nome da CTO';
	ctoLabel.hidden = true;

	const ctoName = document.createElement('input');
	ctoName.className = 'cto-name';
	ctoName.type = 'text';
	ctoName.value = `CTO ${ctoCount}`;
	ctoName.setAttribute('aria-label', 'Nome da CTO');
	ctoLabel.htmlFor = `cto-name-${ctoCount}`;
	ctoName.id = `cto-name-${ctoCount}`;
	ctoName.hidden = true;

	const signalInfo = document.createElement('span');
	signalInfo.className = 'cto-signal';
	signalInfo.textContent = `Sinal de entrada: ${inputSignal.toFixed(2)} dBm`;

	const balancedControl = document.createElement('div');
	balancedControl.className = 'balanced-control';
	const splitterLabel = document.createElement('label');
	splitterLabel.textContent = 'Splitter balanceado';
	let splitterSelect = null;
	const addBalancedButton = document.createElement('button');
	addBalancedButton.className = 'add-splitter add-balanced';
	addBalancedButton.type = 'button';
	addBalancedButton.textContent = '+';
	addBalancedButton.setAttribute('aria-label', 'Adicionar splitter balanceado');

	const splitterRows = document.createElement('div');
	splitterRows.className = 'splitter-rows';
	const unbalancedControl = document.createElement('div');
	unbalancedControl.className = 'unbalanced-control';
	const unbalancedControlLabel = document.createElement('span');
	unbalancedControlLabel.className = 'unbalanced-control-label';
	unbalancedControlLabel.textContent = 'Splitter desbalanceado';
	const addSplitterButton = document.createElement('button');
	addSplitterButton.className = 'add-splitter';
	addSplitterButton.type = 'button';
	addSplitterButton.textContent = '+';
	addSplitterButton.setAttribute('aria-label', 'Adicionar splitter desbalanceado');

	const results = document.createElement('div');
	results.className = 'cto-results';
	results.innerHTML = '<span class="cto-result-label">Sinal que fica na CTO</span><strong class="signal-box">-- dBm</strong><span class="cto-result-label">Sinal que continua</span><strong class="signal-next">-- dBm</strong>';

	function createUnbalancedRow(number) {
		const row = document.createElement('div');
		row.className = 'splitter-row';
		const label = document.createElement('label');
		label.textContent = `Splitter desbalanceado${number > 1 ? ` ${number}` : ''}`;
		const select = createSelect(`unbalanced-${ctoCount}-${number}`, Object.keys(unbalancedLosses));
		select.value = '50/50';
		label.htmlFor = select.id;
		const removeButton = createRemoveButton(`Remover splitter desbalanceado ${number}`);
		removeButton.addEventListener('click', () => removeUnbalancedRow(row));
		row.append(label, select, removeButton);
		if (number === 2 || number === 3) {
			const side = number === 2 ? 'left' : 'right';
			const deriveButton = document.createElement('button');
			deriveButton.className = `derive-button derive-${side}`;
			deriveButton.type = 'button';
			deriveButton.textContent = '+';
			deriveButton.setAttribute('aria-label', `Criar derivação à ${side === 'left' ? 'esquerda' : 'direita'}`);
			if (side === 'left') {
				deriveButton.addEventListener('click', () => createLeftDerivation(deriveButton));
			} else {
				deriveButton.addEventListener('click', () => createRightDerivation(deriveButton));
			}
			row.append(deriveButton);
		}
		select.addEventListener('change', updateCalculation);
		return row;
	}

	function removeUnbalancedRow(row) {
		const removedNumber = [...splitterRows.children].indexOf(row) + 1;
		row.remove();
		updateUnbalancedControl();

		const derivedClass = removedNumber === 2 ? '.derived-left' : removedNumber === 3 ? '.derived-right' : null;
		if (derivedClass) {
			ctoNode.closest('.cto-row')?.querySelector(derivedClass)?.remove();
		}

		[...splitterRows.children].forEach((splitterRow, index) => {
			const number = index + 1;
			const rowLabel = splitterRow.querySelector('label');
			const rowSelect = splitterRow.querySelector('select');
			const rowRemove = splitterRow.querySelector('.remove-splitter');
			rowLabel.textContent = `Splitter desbalanceado${number > 1 ? ` ${number}` : ''}`;
			rowLabel.htmlFor = `unbalanced-${ctoCount}-${number}`;
			rowSelect.id = `unbalanced-${ctoCount}-${number}`;
			rowRemove.setAttribute('aria-label', `Remover splitter desbalanceado ${number}`);
		});

		updateCalculation();
	}

	function registerDerivation(side) {
		const usedSides = ctoNode.dataset.derivationSides
			? JSON.parse(ctoNode.dataset.derivationSides)
			: [];

		if (!usedSides.includes(side)) {
			usedSides.push(side);
		}

		ctoNode.dataset.derivationSides = JSON.stringify(usedSides);
	}

	function createLeftDerivation(deriveButton) {
		const derivedInput = calculateDerivedInput('left');
		if (derivedInput === null) {
			return;
		}
		const row = ctoNode.closest('.cto-row');
		row.classList.add('has-derivation');
		registerDerivation('left');
		deriveButton.remove();
		results.querySelector('.signal-wait-label')?.remove();
		results.querySelector('.signal-wait')?.remove();
		const derivedNode = createCtoNode(derivedInput, true);
		derivedNode.classList.add('derived-left');
		derivedNode.dataset.derivationSource = 'left';
		row.append(derivedNode);
	}

	function createRightDerivation(deriveButton) {
		const derivedInput = calculateDerivedInput('right');
		if (derivedInput === null) {
			return;
		}
		const row = ctoNode.closest('.cto-row');
		row.classList.add('has-derivation');
		registerDerivation('right');
		deriveButton.remove();
		results.querySelector('.signal-wait-2-label')?.remove();
		results.querySelector('.signal-wait-2')?.remove();
		const derivedNode = createCtoNode(derivedInput, true);
		derivedNode.classList.add('derived-right');
		derivedNode.dataset.derivationSource = 'right';
		row.append(derivedNode);
	}

	function calculateDerivedInput(side) {
		const currentInputSignal = Number(ctoNode.dataset.inputSignal);
		const rows = [...splitterRows.querySelectorAll('select')];

		if (side === 'left' && rows.length >= 2) {
			return currentInputSignal
				- unbalancedLosses[rows[0].value][1]
				- unbalancedLosses[rows[1].value][0];
		}

		if (side === 'right' && rows.length >= 3) {
			return currentInputSignal
				- unbalancedLosses[rows[0].value][1]
				- unbalancedLosses[rows[1].value][1]
				- unbalancedLosses[rows[2].value][0];
		}

		return null;
	}

	function updateDerivedInput(selector, signal) {
		const derivedNode = ctoNode.closest('.cto-row')?.querySelector(selector);
		if (!derivedNode || derivedNode === ctoNode) {
			return;
		}

		derivedNode.dataset.inputSignal = signal;
		derivedNode.querySelector('.cto-signal').textContent = `Sinal de entrada: ${signal.toFixed(2)} dBm`;
		derivedNode.recalculate?.();
	}

	function updateCalculation() {
		const currentInputSignal = Number(ctoNode.dataset.inputSignal);
		const balancedLoss = splitterSelect ? balancedLosses[splitterSelect.value] : 0;
		const rows = [...splitterRows.querySelectorAll('select')];
		updateSequenceButton(rows.length > 0);
		const [firstLoss, secondLoss] = rows.length
			? unbalancedLosses[rows[0].value]
			: [0, 0];
		const signalInBox = currentInputSignal - firstLoss - balancedLoss;
		const continuedLoss = rows.reduce((totalLoss, row) => totalLoss + unbalancedLosses[row.value][1], 0);
		const signalNext = currentInputSignal - continuedLoss;
		results.querySelector('.signal-box').textContent = `${signalInBox.toFixed(2)} dBm`;
		results.querySelector('.signal-next').textContent = `${signalNext.toFixed(2)} dBm`;
		const leftDerivedInput = calculateDerivedInput('left');
		const rightDerivedInput = calculateDerivedInput('right');
		if (leftDerivedInput !== null) {
			updateDerivedInput('.derived-left', leftDerivedInput);
		}
		if (rightDerivedInput !== null) {
			updateDerivedInput('.derived-right', rightDerivedInput);
		}
		const wait = rows.length > 1 ? leftDerivedInput : signalNext;
		const waitTwo = rows.length > 2 ? rightDerivedInput : signalNext;
		const usedSides = ctoNode.dataset.derivationSides
			? JSON.parse(ctoNode.dataset.derivationSides)
			: [];
		const hasLeftDerivation = usedSides.includes('left');
		let waitElement = results.querySelector('.signal-wait');
		if (rows.length > 1 && !hasLeftDerivation) {
			if (!waitElement) {
				const waitLabel = document.createElement('span');
				waitLabel.className = 'cto-result-label signal-wait-label';
				waitLabel.textContent = 'Sinal de espera';
				waitElement = document.createElement('strong');
				waitElement.className = 'signal-wait';
				results.append(waitLabel, waitElement);
			}
			waitElement.textContent = `${wait.toFixed(2)} dBm`;
		} else if (rows.length <= 1 || hasLeftDerivation) {
			results.querySelector('.signal-wait-label')?.remove();
			waitElement?.remove();
		}

		if (rows.length > 2) {
			let waitTwoElement = results.querySelector('.signal-wait-2');
			if (!waitTwoElement) {
				const waitTwoLabel = document.createElement('span');
				waitTwoLabel.className = 'cto-result-label signal-wait-2-label';
				waitTwoLabel.textContent = 'Sinal de espera 2';
				waitTwoElement = document.createElement('strong');
				waitTwoElement.className = 'signal-wait-2';
				results.append(waitTwoLabel, waitTwoElement);
			}
			waitTwoElement.textContent = `${waitTwo.toFixed(2)} dBm`;
		} else {
			results.querySelector('.signal-wait-2-label')?.remove();
			results.querySelector('.signal-wait-2')?.remove();
		}
		const nextBranch = ctoNode.closest('.cto-row')?.nextElementSibling;
		if (nextBranch?.classList.contains('diagram-branch')) {
			nextBranch.dataset.inputSignal = signalNext;
			const nextNode = nextBranch.nextElementSibling?.querySelector('.cto-node');
			if (nextNode) {
				nextNode.dataset.inputSignal = signalNext;
				nextNode.querySelector('.cto-signal').textContent = `Sinal de entrada: ${signalNext.toFixed(2)} dBm`;
				nextNode.querySelectorAll('select').forEach((select) => select.dispatchEvent(new Event('change')));
			}
		}
	}

	function updateSequenceButton(canContinue) {
		const nextBranch = ctoNode.closest('.cto-row')?.nextElementSibling;
		const nextButton = nextBranch?.querySelector('.add-step');
		if (nextButton) {
			nextButton.hidden = !canContinue;
		}
	}

	function addSplitter() {
		if (splitterRows.children.length >= 3) {
			return;
		}

		const number = splitterRows.children.length + 1;
		splitterRows.append(createUnbalancedRow(number));
		updateUnbalancedControl();
		updateCalculation();
	}

	function updateUnbalancedControl() {
		unbalancedControl.hidden = splitterRows.children.length >= 3;
	}

	addSplitterButton.addEventListener('click', addSplitter);
	addBalancedButton.addEventListener('click', () => {
			splitterSelect = createSelect(`splitter-${ctoCount}`, ['1x2', '1x4', '1x8', '1x16']);
			splitterLabel.htmlFor = splitterSelect.id;
			splitterSelect.addEventListener('change', updateCalculation);
		const removeBalancedButton = createRemoveButton('Remover splitter balanceado');
		removeBalancedButton.addEventListener('click', () => {
			splitterSelect = null;
			balancedControl.replaceChildren(splitterLabel, addBalancedButton);
			updateCalculation();
		});
		balancedControl.replaceChildren(splitterLabel, splitterSelect, removeBalancedButton);
			updateCalculation();
		});
	ctoNode.recalculate = updateCalculation;

	function commitName() {
		const name = ctoName.value.trim() || `CTO ${ctoCount}`;
		ctoName.value = name;
		ctoTitle.textContent = name;
		ctoName.hidden = true;
		ctoLabel.hidden = true;
		ctoTitleRow.hidden = false;
	}

	function editName() {
		ctoTitleRow.hidden = true;
		ctoLabel.hidden = false;
		ctoName.hidden = false;
		ctoName.focus();
		ctoName.select();
	}

	ctoName.addEventListener('keydown', (event) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			commitName();
		}
	});
	editButton.addEventListener('click', editName);
	editButton.addEventListener('mousedown', (event) => {
		event.preventDefault();
	});
	ctoTitleRow.append(ctoTitle, editButton);
	balancedControl.append(splitterLabel, addBalancedButton);
	unbalancedControl.append(unbalancedControlLabel, addSplitterButton);
	ctoNode.append(
		ctoTitleRow,
		signalInfo,
		balancedControl,
		splitterRows,
		unbalancedControl,
		results,
		ctoLabel,
		ctoName
	);
	if (isDerived) {
		ctoNode.classList.add('derived-node');
	}
	updateCalculation();
	return ctoNode;
}

function createVerticalBranch(inputSignal = '') {
	const branch = document.createElement('div');
	branch.className = 'diagram-branch';
	branch.dataset.inputSignal = inputSignal;
	branch.innerHTML = '<span class="diagram-line"></span><button class="add-step" type="button" aria-label="Adicionar etapa abaixo" hidden>+</button>';
	branch.querySelector('.add-step').addEventListener('click', addCtoNode);

	return branch;
}

firstAddButton.addEventListener('click', addCtoNode);
initialSignalInput.addEventListener('input', () => validateInitialSignal());
initialSignalInput.addEventListener('blur', () => {
	if (validateInitialSignal(true)) {
		commitInitialSignal();
	}
});

initialSignalInput.addEventListener('keydown', (event) => {
	if (event.key !== 'Enter') {
		return;
	}

	event.preventDefault();
	if (validateInitialSignal(true)) {
		commitInitialSignal();
	}
});
editSignalButton.addEventListener('click', editInitialSignal);
editSignalButton.addEventListener('mousedown', (event) => {
	event.preventDefault();
});
