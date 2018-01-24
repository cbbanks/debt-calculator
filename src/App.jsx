import React, { Component } from 'react';

import Debt from './models/Debt';
import Store from './services/Store';

import DebtList from './components/DebtList.jsx';
import DebtDialog from './components/DebtDialog.jsx';
import DebtPlot from './components/DebtPlot.jsx';
import formatCurrency from './helpers/Currency';

class App extends Component {
  constructor() {
    super();

    this.state = {
      modalIsOpen: false,
      debts: Store.getAll(Debt)
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.editDebt = this.editDebt.bind(this);
    this.saveDebt = this.saveDebt.bind(this);
    this.clear = this.clear.bind(this);
    this.removeDebt = this.removeDebt.bind(this);
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  editDebt(debt) {
    this.setState({ curDebtObj: debt });
    this.openModal();
  }

  saveDebt(debt) {
    const { debts } = this.state;

    // TODO: Make store manage the list of debts
    if (!debts.includes(debt)) {
      debts.push(debt);
    }

    debt.save();
    this.setState({ debts });
  }

  removeDebt(debt) {
    let { debts } = this.state;
    debts = debts.filter(_debt => _debt !== debt);
    debt.destroy();
    this.setState({ debts });
  }

  clear() {
    Store.clear();
    this.setState({ debts: [] });
  }

  generateSummary() {
    return {
      totalCurrentDebt: this.state.debts.reduce(
        (t, debt) => t + debt.principle,
        0
      )
    };
  }

  render() {
    const summary = this.generateSummary();

    return (
      <div className="App container">
        <div className="row">
          <div className="col-md-4">
            <DebtList
              debts={this.state.debts}
              editDebt={this.editDebt}
              removeDebt={this.removeDebt}
            />
            <button className="btn btn-default" onClick={this.openModal}>
              Add Debt
            </button>
            <button className="btn btn-default" onClick={this.clear}>
              Clear Everything
            </button>
          </div>
          <div className="col-md-8">
            <div className="panel panel-default">
              <div className="panel-heading">Projections</div>
              <div className="panel-body">
                <DebtPlot
                  debts={this.state.debts}
                  monthlyPayment={this.state.monthlyPayment}
                  width={600}
                  height={300}
                />
              </div>
            </div>
            <div className="panel panel-default">
              <div className="panel-heading">Debt Summary</div>
              <div className="panel-body">
                <dl className="dl-horizontal">
                  <dt>Total Current Debt</dt>
                  <dd>{formatCurrency(summary.totalCurrentDebt)}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <DebtDialog
          isOpen={this.state.modalIsOpen}
          onClose={this.closeModal}
          debtObj={this.state.curDebtObj}
          onSave={this.saveDebt}
        />
      </div>
    );
  }
}

export default App;
