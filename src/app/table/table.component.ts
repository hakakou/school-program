import { Injectable } from '@angular/core';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Schedule } from "../schedule";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})

@Injectable({ providedIn: 'root' })
export class TableComponent implements AfterViewInit, OnInit {

  data: Schedule;

  constructor(private http: HttpClient) {
    this.http = http;
  }

  async getData(): Promise<Schedule> {
    return this.http.get<Schedule>("program.json").toPromise();
  }

  name(id: string) {
    var name = this.data.links.find(c => c.url == id).name;
    return name.split('(')[0].trim();
  }

  async ngOnInit() {
  }

  async ngAfterViewInit() {
    this.data = await this.getData()
    document.title = this.data.title;

    setTimeout(() => this.Update(), 0);

    var worker = new Worker('worker.js');
    worker.onmessage = () => this.Update();
  }

  Update(): void {
    // Clear all active classes
    document.querySelectorAll(".cell").forEach(element => {
      element.classList.remove("done", "ready", "exec");
    });
    document.querySelectorAll(".dial").forEach(element => {
      element.classList.remove("show");
    });

    var d = new Date();

    // For testing
    // var d = new Date("2021-02-11 12:29");
    // console.log(d);

    var weekdayClass = ".weekday_" + d.getDay();

    var nowMinutes = d.getHours() * 60 + d.getMinutes();
    var lastEndMinutes = null;

    this.data.hours.forEach((h, i) => {

      var timeClass = ".time_" + i;

      var split = h.start.split(':');
      var minutesStart = Number.parseInt(split[0]) * 60 + Number.parseInt(split[1]);

      var splitEnd = h.stop.split(':');
      var minutesEnd = Number.parseInt(splitEnd[0]) * 60 + Number.parseInt(splitEnd[1]);

      document.querySelectorAll(weekdayClass + timeClass).forEach(element => {
        if (nowMinutes > minutesEnd)
          element.classList.add("done");
        if (minutesStart - 5 < nowMinutes && nowMinutes < minutesStart)
          element.classList.add("ready");
        if (minutesStart <= nowMinutes && nowMinutes <= minutesEnd)
          element.classList.add("exec");
      });

      if (lastEndMinutes != null && nowMinutes > lastEndMinutes && nowMinutes < minutesStart) {
        document.querySelectorAll(".dial").forEach(e => {
          e.classList.add("show");
        });
      }

      lastEndMinutes = minutesEnd;
    });

  };

}
