import React from 'react';
import PropTypes from 'prop-types';

import bankLogos from './helpers/BankLogos';

import styles from './style.css';

const BankLogo = ({
  bank = '',
  model = '',
  type = ''
}) => {
  if (
    !bankLogos[bank] ||
    !bankLogos[bank][model] ||
    !bankLogos[bank][model][type]
  ) {
    return null;
  }

  return (
    <img
      src={bankLogos[bank][model][type]}
      alt={bank}
      className={styles[`${bank}-${model}-${type}`]}
    />
  );
};

BankLogo.propTypes = {
  bank: PropTypes.string,
  model: PropTypes.string,
  type: PropTypes.string,
};

export default BankLogo;
