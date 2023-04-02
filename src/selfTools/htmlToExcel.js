import FileSaver from "file-saver";
import * as XLSX from "xlsx";

const htmlToExcel = {
  getExcel(dom, title = "默认标题") {
    var excelTitle = title;
    var wb = XLSX.utils.table_to_book(document.querySelector(dom));
    /* 获取二进制字符串作为输出 */
    var wbout = XLSX.write(wb, {
      bookType: "xlsx",
      bookSST: true,
      type: "array",
    });
    try {
      FileSaver.saveAs(
        new Blob([wbout], { type: "application/octet-stream" }),
        excelTitle + ".xlsx"
      );
    } catch (e) {
      if (typeof console !== "undefined") console.log(e, wbout);
    }
    return wbout;
  },
};

export default htmlToExcel;
/*使用XLSX.write方法将workbook对象转换为二进制字符串。最后，通过FileSave
r.js库的saveAs方法，将二进制字符串保存为Excel文件。如果保存失败，会在控制台输
出错误信息和二进制字符串。方法最终返回二进制字符串。*/