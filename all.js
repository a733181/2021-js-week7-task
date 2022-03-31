'use strict';

const getData = (function () {
  const xhr = new XMLHttpRequest();
  const url = `https://raw.githubusercontent.com/hexschool/2021-ui-frontend-job/master/frontend_data.json?token=AAQWFQDSNRRXC6FBW7PDSETBOESVW`;
  xhr.open('get', url, true);
  xhr.send();
  xhr.addEventListener('load', function () {
    if (xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      // console.log(data);
      gender(data);
      accCompany(data);
      gameAndEshopCompany(data);
      salary(data);
    } else {
      console.log(`Error ${xhr.status}`);
    }
  });
})();

// 接案公司的薪資滿意度
function accCompany(data) {
  const accCompanyScData = data
    .filter((value) => value['company']['industry'] === '接案公司')
    .map((value) => value['company']['salary_score']);
  // console.log(accCompanySaData);
  c3js(accCompanyScData);
  function c3js(data) {
    const company = c3.generate({
      bindto: '.accCompany',
      data: {
        columns: [['接案公司薪資滿意度', ...data]],
        type: 'bar',
      },
    });
  }
}
// 抓取博弈、電商公司兩個產業滿意度的平均分數
function gameAndEshopCompany(data) {
  function CompanyScAvg(companyName) {
    return data
      .filter((value) => value['company']['industry'] === companyName)
      .map((value) => value['company']['score'])
      .reduce((add, value, i, arr) => add + value / arr.length, 0)
      .toFixed(2);
  }
  c3js(CompanyScAvg('博奕'), CompanyScAvg('電子商務'));
  function c3js(game, eshop) {
    const company = c3.generate({
      bindto: '.gameAndEshopCompany',
      data: {
        columns: [
          ['博奕滿意度的平均分數', game],
          ['電子商務滿意度的平均分數', eshop],
        ],
        type: 'bar',
      },
    });
  }
}
// 男女生比例
function gender(data) {
  let manNum = 0;
  let womanNum = 0;
  data.forEach(function (item) {
    item['gender'] === '男性' ? manNum++ : womanNum++;
  });
  c3js(manNum, womanNum);
  function c3js(nam, woman) {
    const gender = c3.generate({
      bindto: '.gender',
      data: {
        columns: [
          ['男性', nam],
          ['女性', woman],
        ],
        type: 'pie',
      },
    });
  }
}

//顯示薪水區間分佈
function salary(data) {
  const salaryData = [];
  salaryNum();
  function salaryNum() {
    const salaryInterval = new Set(
      data.map((value) => value['company']['salary'])
    );
    salaryInterval.forEach((value) => {
      let num = 0;
      data.forEach((salary) => {
        if (salary['company']['salary'] === value) {
          num++;
        }
      });
      const arr = [];
      arr.push(value);
      arr.push(num);
      salaryData.push(arr);
    });
  }
  c3js(salaryData);
  function c3js(salaryData) {
    const salary = c3.generate({
      bindto: '.salary',
      data: {
        columns: salaryData,
        type: 'pie',
      },
    });
  }
}
