import React, { ReactNode, ReactNodeArray } from 'react';

import X from '../../svgs/x.svg';
import O from '../../svgs/o.svg';

import styles from './Field.module.scss';

interface IFieldProps {
    children?: ReactNode|ReactNodeArray;
}

export default function Field({children}: IFieldProps) {
    return (
        <div className={styles.field}>{!!children && children}</div>
    );
}

interface IFieldBoxProps {
    symbol: 'X' | 'O' | null;
    onClick: () => void;
}

export function FieldBox({symbol, onClick}: IFieldBoxProps) {
    const symbols = {
        X,
        O
    }

    return (
        <div className={styles.box} onClick={onClick}>
            {
                !!symbol &&
                <img src={symbols[symbol]} alt={`The symbol of this box is ${symbol}`}/>
            }
        </div>
    );
}