import './index.css';

import { useState } from 'react';
import Grid from '../../component/grid';
import FieldForm from '../../component/field-form';

import { Alert, Loader, LOAD_STATUS } from '../../component/load';

export default function Container({ onCreate, placeholder, button, id = null }) {
   const [status, setStatus] = useState(null);
   const [message, setMessage] = useState('');

   const handleSubmit = (value) => {
      return sendData({ value });
   };

   const sendData = async (dataToSend) => {
      //! вказуєм що у нас починається завантаження нашого запиту на сервер.....
      setStatus(LOAD_STATUS.PROGRESS);

      try {
         const res = await fetch('http://localhost:4000/post-create', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: convertData(dataToSend),
         });

         const data = await res.json();

         if (res.ok) {
            setStatus(null);

            if (onCreate) onCreate();
         } else {
            setMessage(data.message);
            setStatus(LOAD_STATUS.ERROR);
         }
      } catch (e) {
         //! ВАЖЛИВО: спочатку message ставити а потім setStatus
         setMessage(e.message);
         setStatus(LOAD_STATUS.ERROR);
      }
   };

   const convertData = ({ value }) =>
      JSON.stringify({
         //! текст який ввели в поле
         text: value,
         //! тут будемо ставити якийсь рядок так як у нашому додатку немає аутентифікації і логіки класу Юзера, тому буде просто рядок...
         username: 'user',
         postId: id,
      });

   return (
      <Grid>
         <FieldForm placeholder={placeholder} button={button} onSubmit={handleSubmit} />
         {status === LOAD_STATUS.ERROR && (
            <Alert status={status} message={message} />
         )}
         {status === LOAD_STATUS.PROGRESS && <Loader />}
      </Grid>
   );
}
