module.exports = {
    compareDateIsBigger: (smallerDate, biggerDate) => {
        return new Date(smallerDate) < new Date(biggerDate);
    }
};
