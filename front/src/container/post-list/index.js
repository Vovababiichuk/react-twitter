import React from 'react';

import { useState } from 'react';
import { Fragment } from 'react';

import Title from '../../component/title';
import Grid from '../../component/grid';
import Box from '../../component/box';
import PostCreate from '../../container/post-create';
import { Alert, Skeleton, LOAD_STATUS } from '../../component/load';
import { getDate } from '../../util/getDate';
import PostItem from '../../container/post-item';

export default function Container() {
   const [status, setStatus] = useState(null);
   const [message, setMessage] = useState('');
   //! щоб тримати дані які ми отримали з сервера
   const [data, setData] = useState(null);

   const getData = async () => {
      setStatus(LOAD_STATUS.PROGRESS);

      try {
         const res = await fetch('http://localhost:4000/post-list', {
            method: 'GET',
         });

         const data = await res.json();

         if (res.ok) {
            setData(convertData(data));
            setStatus(LOAD_STATUS.SUCCESS);
         } else {
            setMessage(data.message);
            setStatus(LOAD_STATUS.ERROR);
         }
      } catch (e) {
         setMessage(e.message);
         setStatus(LOAD_STATUS.ERROR);
      }
   };

   const convertData = (raw) => ({
      list: raw.list.reverse().map(({ id, username, text, date }) => ({
         id,
         username,
         text,
         date: getDate(date),
      })),

      isEmpty: raw.list.length === 0,
   });

   if (status === null) {
      getData();
   }

   return (
      <Grid>
         <Box>
            <Grid>
               <Title>Home</Title>
               <PostCreate
                  //! пропс onCreate ми кладемо в getData щоб коли у нас створювався новий пост ми відразу оновлювали список постів...і показували актуальний список постів з нашим новим постом...
                  onCreate={getData}
                  placeholder="What is happening?"
                  button="Post"
               />
            </Grid>
         </Box>

         {status === LOAD_STATUS.PROGRESS && (
            <Fragment>
               <Box>
                  <Skeleton />
               </Box>
               <Box>
                  <Skeleton />
               </Box>
            </Fragment>
         )}

         {status === LOAD_STATUS.ERROR && <Alert status={status} message={message} />}

         {status === LOAD_STATUS.SUCCESS && (
            <Fragment>
               {data.isEmpty ? (
                  <Alert message="Список постів пустий" />
               ) : (
                  data.list.map((item) => (
                     <Fragment key={item.id}>
                        <PostItem {...item} />
                     </Fragment>
                  ))
               )}
            </Fragment>
         )}
      </Grid>
   );
}
