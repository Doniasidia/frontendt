import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './style.css';
import BankLogo from '../BankLogo';
import ModelLogo from '../ModelLogo';
import BrandLogo from '../BrandLogo';

const cardClasses = (bank, model, type, flipped, className) => {
  const cardClassName = `${bank}-${model}-${type}`;

  return classNames(
    styles.card,
    styles[bank],
    {
      [styles.flipped]: flipped,
      [styles[cardClassName]]: (bank && model && type),
    },
    className,
  );
};

const formatCardNumber = cardNumber =>
  cardNumber.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ');

const PaymentCard = ({
  bank = '',
  model = '',
  type = '',
  brand = '',
  number = '•••• •••• •••• ••••',
  cvv = '•••',
  holderName = 'Nome Completo',
  expiration = 'MM/AA',
  flipped = false,
  className = '',
}) => (
  <div className={styles.wrapper}>
    <div className={cardClasses(bank, model, type, flipped, className)}>
      <div className={styles.front}>
        <BankLogo
          bank={bank}
          model={model}
          type={type}
        />
        <ModelLogo
          bank={bank}
          model={model}
          type={type}
        />
        <div className={styles.chip}>
          <div className={styles.horizontalLine} />
          <div className={styles.verticalLine} />
        </div>
        <div className={styles.number}>
          {formatCardNumber(number)}
        </div>
        <div className={styles.expiration}>
          {expiration}
        </div>
        <div className={styles.holderName}>
          {holderName}
        </div>
        <BrandLogo
          brand={brand}
          bank={bank}
          model={model}
          type={type}
        />
      </div>
      <div className={styles.back}>
        <div className={styles.cvv}>
          {cvv}
        </div>
      </div>
    </div>
  </div>
);

PaymentCard.propTypes = {
  bank: PropTypes.string,
  model: PropTypes.string,
  type: PropTypes.string,
  brand: PropTypes.string,
  number: PropTypes.string,
  cvv: PropTypes.string,
  holderName: PropTypes.string,
  expiration: PropTypes.string,
  flipped: PropTypes.bool,
  className: PropTypes.string,
};

export default PaymentCard;
