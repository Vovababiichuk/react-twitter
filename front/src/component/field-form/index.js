import './index.css';

import { useState } from 'react';

export default function Component({ placeholder, button, onSubmit }) {
   const [value, setValue] = useState('');

   //! задавати значення нашого поля
   const handleChange = (e) => setValue(e.target.value);

   const handleSubmit = () => {
      //! повертаєм null..завершаєм ф-ю
      if (value.length === 0) return null;
      if (onSubmit) {
         onSubmit(value);
      } else {
         throw new Error('onSubmit is not defined');
      }

         //! щоб наше поле не мало текст який я до цього передав в onSubmit
      setValue('');
   }

   //! Константа яка генерується в моменті при рендері. Вона відповідає за те щоб вказати чи кнопка активна чи не активна...винесли щоб можна було ще якусь логіку дописати якщо буде потрібно...
   const isDisabled = value.length === 0;

   return (
      <div className='field-form'>
         <textarea
            onChange={handleChange}
            value={value}
            //! додали атрибут rows для того щоб textarea мав 2 рядка
            rows={2}
            placeholder={placeholder}
            className='field-form__field'
         ></textarea>
         <button
            disabled={isDisabled}
            onClick={handleSubmit}
            className='field-form__button'
         >
            {button}
         </button>
      </div>
   )
}