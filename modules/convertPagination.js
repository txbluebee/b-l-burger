const convertPagination = function(resource, currentPage){

  const totalItems = resource.length;
    const perpage = 6;
    const pageTotal = Math.ceil(totalItems/perpage);
    if (currentPage > pageTotal) currentPage = pageTotal;
    
    const minIndex = (currentPage*perpage)-perpage + 1;
    const maxIndex = currentPage*perpage;
    const data = [];
    resource.forEach((item, index)=>{
      index++;
      if (minIndex <= index && index <= maxIndex){
        data.push(item);
      }
    })
    const page = {
      pageTotal,
      currentPage,
      hasPre: currentPage > 1,
      hasNext: currentPage < pageTotal
    }
    return {
      page,
      data
    }
}

module.exports = convertPagination;