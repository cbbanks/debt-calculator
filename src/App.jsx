import React, { Component } from 'react';

import Debt from './models/Debt';
import Store from './services/Store';

import DebtList from './components/DebtList';
import DebtDialog from './components/DebtDialog';
import DebtPlot from './components/DebtPlot';
import InputCurrency from './components/InputCurrency';
import formatCurrency from './helpers/Currency';
import CalculateResults from './helpers/CalculateResults';

// Import icons
import PlusIcon from 'react-icons/lib/ti/plus';
import TrashIcon from 'react-icons/lib/ti/trash';

class App extends Component {
  constructor() {
    super();

    this.state = {
      modalIsOpen: false,
      debts: Store.getAll(Debt),
      monthlyContribution: 30000
    };
    this.calculateResults(true);

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.editDebt = this.editDebt.bind(this);
    this.saveDebt = this.saveDebt.bind(this);
    this.clear = this.clear.bind(this);
    this.removeDebt = this.removeDebt.bind(this);
  }

  calculateResults(isInit = false) {
    const { debts, monthlyContribution, strategy } = this.state;
    const results = CalculateResults(debts, monthlyContribution, strategy);
    if (isInit) {
      Object.assign(this.state, results);
    } else {
      this.setState(results);
    }
  }

  setMonthlyContribution(value) {
    this.setState({ monthlyContribution: value });
    this.calculateResults();
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  editDebt(debt) {
    this.setState({ debt });
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
    this.calculateResults();
  }

  removeDebt(debt) {
    let { debts } = this.state;
    debts = debts.filter(_debt => _debt !== debt);
    debt.destroy();
    this.setState({ debts });
    this.calculateResults();
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

    const chris = <a href="http://linkedin.com/in/christopher-banks">Chris</a>;
    const sean = <a href="http://linkedin.com/in/seantherockjohnson">Sean</a>;

    const authors = Math.random() > 0.5 ? [chris, sean] : [sean, chris];
    const year = new Date().getFullYear();

    return (
      <div className="App container">
        <div className="row">
          <div className="col-md-4">
            <div className="card">
              <DebtList
                debts={this.state.debts}
                editDebt={this.editDebt}
                removeDebt={this.removeDebt}
                className="list-group-flush"
              />
              <div className="card-body">
                <button
                  className="btn btn-primary mr-2"
                  onClick={this.openModal}
                >
                  <PlusIcon /> Add Debt
                </button>
                <button className="btn btn-danger" onClick={this.clear}>
                  <TrashIcon /> Clear Everything
                </button>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Payment Strategy</h4>
                <div className="form-group">
                  <label htmlFor="monthlyContribution">
                    Total Monthly Contribution:
                  </label>
                  <InputCurrency
                    name="monthlyContribution"
                    value={this.state.monthlyContribution}
                    onChange={evt =>
                      this.setMonthlyContribution(evt.target.value)
                    }
                  />
                </div>
                <div className="btn-group">
                  <button className="btn btn-primary active">Snowball</button>
                  <button className="btn btn-primary">
                    High Interest First
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-8">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">Projections</h3>
                <DebtPlot
                  debts={this.state.debts}
                  graphData={this.state.graphData}
                  width={600}
                  height={300}
                />
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <h3 className="card-title">Debt Summary</h3>
                <div className="card-text">
                  <dl className="dl-horizontal">
                    <dt>Total Current Debt</dt>
                    <dd>{formatCurrency(summary.totalCurrentDebt)}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer className="row">
          <p className="card-body">
            Made by {authors[0]} &amp; {authors[1]} &copy; {year}
          </p>
        </footer>
        <DebtDialog
          isOpen={this.state.modalIsOpen}
          onClose={this.closeModal}
          debt={this.state.debt}
          onSave={this.saveDebt}
        />
      </div>
    );
  }
}

export default App;
