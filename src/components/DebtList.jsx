import React, { Component } from 'react';
import DebtListItem from './DebtListItem.jsx';

class DebtList extends Component {
  render() {
    const DebtListItems = this.props.debts.map(debt => {
      return (
        <DebtListItem
          debt={debt}
          key={debt.id}
          editDebt={this.props.editDebt}
          removeDebt={this.props.removeDebt}
        />
      );
    });

    return <ul className="list-group">{DebtListItems}</ul>;
  }
}

export default DebtList;
