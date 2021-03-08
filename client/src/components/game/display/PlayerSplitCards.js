import React from 'react'

const PlayerSplitCards = ({card}) => {
  return ( <li className="card_item_split" weight={card.weight} key="1">
    <div className='card red'>
        <div className='card-topleft'>
            <div className='card-corner-rank'>{card.value}</div>
            <div className='card-corner-suit'>{card.suit}</div>
        </div>
        <div className='card-bottomright'>
            <div className='card-corner-rank'>{card.value}</div>
            <div className='card-corner-suit'>{card.suit}</div>
        </div>
    </div>
    </li>
  )
}
export default PlayerSplitCards