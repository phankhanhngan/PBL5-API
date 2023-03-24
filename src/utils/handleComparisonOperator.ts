class comparisonOp {
  private reqQuery;
  constructor(reqQuery) {
    this.reqQuery = reqQuery;
  }

  format = () => {
    const formattedQuery = {};
    Object.keys(this.reqQuery).forEach((key) => {
      formattedQuery[`$${key}`] = parseFloat(this.reqQuery[key]);
    });
    return formattedQuery;
  };
}

export default comparisonOp;
