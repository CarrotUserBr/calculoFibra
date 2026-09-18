const splitterLossTable = {
  '1x2': { balanceado: 3.0, desbalanceado: [3.0, 3.5] },
  '1x4': { balanceado: 6.0, desbalanceado: [6.1, 6.4, 6.7, 7.0] },
  '1x8': { balanceado: 9.0, desbalanceado: [9.2, 9.5, 9.8, 10.1, 10.4, 10.7, 11.0, 11.3] },
  '1x16': { balanceado: 12.0, desbalanceado: [12.2, 12.5, 12.8, 13.1, 13.4, 13.7, 14.0, 14.3, 14.6, 14.9, 15.2, 15.5, 15.8, 16.1, 16.4, 16.7] },
  '1x32': { balanceado: 15.0, desbalanceado: [15.2, 15.5, 15.8, 16.1, 16.4, 16.7, 17.0, 17.3, 17.6, 17.9, 18.2, 18.5, 18.8, 19.1, 19.4, 19.7, 20.0, 20.3, 20.6, 20.9, 21.2, 21.5, 21.8, 22.1, 22.4, 22.7, 23.0, 23.3, 23.6, 23.9, 24.2, 24.5] }
};

document.getElementById('calculator-form').addEventListener('submit', function (event) {
  event.preventDefault();

  const inputSignal = Number(document.getElementById('inputSignal').value || 0);
  const splitterType = document.getElementById('splitterType').value;
  const splitterMode = document.getElementById('splitterMode').value;
  const ctoLoss = Number(document.getElementById('ctoLoss').value || 0);

  const splitterData = splitterLossTable[splitterType];
  const lossByOutput = splitterMode === 'balanceado'
    ? splitterData.balanceado
    : splitterData.desbalanceado;

  const totalLoss = Array.isArray(lossByOutput) ? lossByOutput[0] : lossByOutput;
  const outputSignal = inputSignal - totalLoss - ctoLoss;
  const futureSignal = inputSignal - totalLoss - ctoLoss - 1.0;

  document.getElementById('signalAfterSplitter').textContent = `${outputSignal.toFixed(2)} dBm`;
  document.getElementById('signalBox').textContent = `${outputSignal.toFixed(2)} dBm`;
  document.getElementById('signalFuture').textContent = `${futureSignal.toFixed(2)} dBm`;

  const status = outputSignal >= -15 ? 'Status: sinal dentro do limite aceitável.' : 'Status: atenção, sinal abaixo do limite ideal.';
  document.getElementById('status').textContent = status;
});
