// dealer is dealers first card
// player is players hand value
// isSoft, does the player hand include an ace
// isOriginalHand player hand after initial deal (2 cards)
// isPair if player has double
const getBasicStrategy = (dealerCard, playerTotal, isOriginalHand = true,  isSoft = false, isPair = false) => {
   const stay = 'Stay';
   const hit = 'Hit';
   const double = 'Double';
   const split = 'Split'
   console.log("Dealer Cart: ", dealerCard, "player total: ", playerTotal, "isOriginalHand", isOriginalHand,  "isSoft", isSoft,  "isPair", isPair)
    if (!isSoft && !isPair) {
        console.log('is hard and not a pair')
        if (playerTotal <= 8) {
            return hit
        } else if (playerTotal == 9) {
            if ([3,4,5,6].includes(dealerCard) && isOriginalHand)
                return double;
            else 
                return hit;
        } else if (playerTotal == 10 ) {
            if ([2,3,4,5,6,7,8,9].includes(dealerCard) && isOriginalHand)
                return double;
            else 
                return hit;
        } else if (playerTotal == 11 ) {
            if ([2,3,4,5,6,7,8,9,10].includes(dealerCard) && isOriginalHand)
                return double;
            else 
                return hit;
        } else if (playerTotal == 12 ) {
            if ([4,5,6].includes(dealerCard) && isOriginalHand)
                return stay;
            else 
                return hit;
        } else if (playerTotal > 12 && playerTotal < 17 ) {
            if (dealerCard < 7)
                return stay;
            else 
                return hit;
        } else {
            return stay;
        }
    } else if (isSoft && !isPair) {
        console.log('is soft and not a pair')
        if (playerTotal == 13 || playerTotal == 14) {
            if ([5,6].includes(dealerCard) && isOriginalHand)
                return double;
            else 
                return hit;
        } else if (playerTotal == 15 || playerTotal == 16) {
            if ([4,5,6].includes(dealerCard) && isOriginalHand)
                return double;
            else 
                return hit;
        } else if (playerTotal == 17) {
            if ([3,4,5,6].includes(dealerCard) && isOriginalHand)
                return double;
            else 
                return hit;
        } else if (playerTotal == 18) {
            if ([3,4,5,6].includes(dealerCard) && isOriginalHand)
                return double;
            else if ([2,7,8].includes(dealerCard) && isOriginalHand)
                return stay;
            else 
                return hit;
        } else {
            return stay;
        }
    } else if (isPair && isOriginalHand) {
        console.log('is a pair')
        if (playerTotal == 4 || playerTotal == 6) {
            if (dealerCard < 8)
                return split;
            else 
                return hit;
        } else if (playerTotal == 8) {
            if ([5,6].includes(dealerCard))
                return split;
            else 
                return hit;
        } else if (playerTotal == 10) {
            if (dealerCard < 10)
                return double;
            else 
                return hit;
        } else if (playerTotal == 12) {
            if (dealerCard < 7)
                return split;
            else 
                return hit;
        } else if (playerTotal == 14) {
            if (dealerCard < 8)
                return split;
            else 
                return hit;
        } else if (playerTotal == 16 || playerTotal == 2) {
            if (dealerCard < 8)
                return split;
        } else if (playerTotal == 18) {
            if ([2,3,4,5,6, 8,9].includes(dealerCard))
                return split;
            else 
                return stay;
        } else {
            return stay;
        }
    } else {
        return 'Error evaluating correct play';
    }

};
export default getBasicStrategy;