import React from 'react'

const DealerCards = ({dealer, showDealerCards}) => {
console.log(this)
  if (!showDealerCards) {
        return (
            <li className="cardItem" weight={dealer[0].weight} key="1">
                    <div className='card red'>
                        <div className='card-topleft'>
                            <div className='card-corner-rank'>{dealer[0].value}</div>
                            <div className='card-corner-suit card-corner-suit-small'>{dealer[0].suit}</div>
                        </div>
                        <div className='card-bottomright'>
                            <div className='card-corner-rank card-corner-rank-small-bottom'>{dealer[0].value}</div>
                            <div className='card-corner-suit card-corner-suit-small-bottom'>{dealer[0].suit}</div>
                        </div>
                    </div>
                </li>
        )
        } else {
            return ( dealer.map(card => {
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
}
export default DealerCards