import React, { forwardRef } from 'react';
import { DnSelectItemProps } from './types';

/**
 * DnSelectItem
 */
function DnSelectItemImpl(
  { children, isSelected = false }: DnSelectItemProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  return (
    <div ref={ref} className={`dn-select-item ${isSelected ? 'selected' : ''}`}>
      {children}
    </div>
  );
}

const DnSelectItem = forwardRef(DnSelectItemImpl);

export default DnSelectItem;
