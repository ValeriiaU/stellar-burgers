import { FC, memo, useEffect } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from '../../services/store';
import { removeIngredient, moveElemet } from '../../services/constructorSlice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    const handleMoveDown = () => {
      const ingredientId = ingredient.id;
      const newIndex = index + 1;
      dispatch(moveElemet({ ingredientId, newIndex }));
    };

    const handleMoveUp = () => {
      const ingredientId = ingredient.id;
      const newIndex = index - 1;
      dispatch(moveElemet({ ingredientId, newIndex }));
    };

    const handleClose = () => {
      dispatch(removeIngredient({ id: ingredient.id }));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
