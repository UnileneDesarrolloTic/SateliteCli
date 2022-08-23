// import { Component, OnInit } from '@angular/core';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef
} from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';

import { Subject } from 'rxjs';

import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
  CalendarDateFormatter,
  DateFormatterParams,
} from 'angular-calendar';
import { getISOWeek } from 'date-fns';
import { DatePipe } from '@angular/common';
import { NgForm } from '@angular/forms';

const colors: any = {
  red: {
    primary: '#ff5c6c',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#24d2b5',
    secondary: '#FDF1BA'
  }
};



@Component({
  selector: 'app-seguimiento-orden-compra',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './seguimiento-orden-compra.component.html',
  styleUrls: ['./seguimiento-orden-compra.component.css']
})
export class SeguimientoOrdenCompraComponent implements OnInit {

  constructor(private modal: NgbModal) {

  }

  ngOnInit(): void {
  }

  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;
  @ViewChild('modalContentAdd', { static: true }) modalContentAdd!: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();


  public weekViewTitle({ date, locale }: DateFormatterParams): string {
    const year: string = new DatePipe(locale).transform(date, 'y', locale);
    const weekNumber: number = getISOWeek(date);
    return `Semaine ${weekNumber} en ${year}`;
  }


  /*/////////////////////////////////////
  Event action buttons
  ////////////////////////////////////*/
  actions: CalendarEventAction[] = [
    {
      label: '<span class="badge badge-info ml-1"><i class="ti-pencil"></i></span>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edit', event);
      },
    },
    {
      label: '<span class="badge badge-danger ml-1"><i class="ti-trash"></i></span>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh: Subject<any> = new Subject();
  /*/////////////////////////////////////
  Default Events added
  ////////////////////////////////////*/
  events: CalendarEvent[] = [
    {
      start: subDays(startOfDay(new Date()), 1),
      end: subDays(startOfDay(new Date()), 1),
      title: 'A 3 day event',
      color: colors.blue,
      actions: this.actions,
           
    },
  ];

  activeDayIsOpen: boolean = true;
  modalData!: {
    action: string;
    event: CalendarEvent;
  };
 
  /*/////////////////////////////////////
  On Day Click
  ////////////////////////////////////*/
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    console.log(date);
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    console.log(action,event)
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }
  

  onSubmit(data: NgForm) {
    this.events = [
      ...this.events,
      {
        title: data.value.title,
        start: data.value.startDate,
        end: data.value.endDate,
        color: data.value.color,
        actions: this.actions,
        allDay: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
        draggable: true,
      },
    ];
    this.modal.dismissAll();

  }
  /*/////////////////////////////////////
  Delete Event
  ////////////////////////////////////*/
  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    console.log(view)
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

}
