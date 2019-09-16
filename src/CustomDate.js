class CustomDate{
  constructor(date){
    this.set(date);
  }

  set(date = {}){
    if(date instanceof Date){
      this.setFromDate(date);
    }else{
      this.setFromProps(date);
    }
  }

  isBefore(date){
    const { year, month, day } = date;

    return this.year < year || (year === this.year &&
      (this.month < month || (month === this.month && this.day < day)))
  }

  isAfter(date){
    const { year, month, day } = date;

    return this.year > year || (year === this.year &&
      (this.month > month || (month === this.month && this.day > day)))
  }

  isEqualTo(date){
    const { year, month, day } = date;

    return year === this.year && month === this.month && day === this.day;
  }

  setFromDate(date){
    this.year = date.getFullYear();
    this.month = date.getMonth();
    this.day = date.getDate();
  }

  setFromProps(date){
    this.year = typeof date.year === "number" ? date.year : new Date().getFullYear();
    this.month = typeof date.month === "number" ? date.month : new Date().getMonth();
    this.day = typeof date.day === "number" ? date.day : new Date().getDate();
  }

  addDays(value){
    let newDate = this.getDateObject();
    newDate.setDate(newDate.getDate() + value);
    return new CustomDate(newDate);
  }

  getDateObject(){
    return new Date(this.year, this.month, this.day);
  }
}

export default CustomDate;
