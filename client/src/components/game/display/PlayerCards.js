import React from 'react'

const PlayerCards = ({hand}) => {
  return ( hand.map(card => {
        return <li className="cardItem" weight={card.weight} key="1">
        <div className='card red'>
            <div className='card-topleft'>
                <div className='card-corner-rank'>{card.value}</div>
                <div className='card-corner-suit card-corner-suit-small'>{card.suit}</div>
            </div>
            <div className='card-bottomright'>
                <div className='card-corner-rank card-corner-rank-small-bottom'>{card.value}</div>
                <div className='card-corner-suit card-corner-suit-small-bottom'>{card.suit}</div>
            </div>
        </div>
    </li>
    })
  )
}
export default PlayerCards