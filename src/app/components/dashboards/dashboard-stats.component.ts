import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-stats',
  templateUrl: './dashboard-stats.component.html',
  styleUrls: ['dashboard-stats.component.scss']
})
export class DashBoardStatsComponent {
  @Input()
  title: any;
  @Input()
  valueDash: any;
  @Input()
  statsDash: any;
  @Input()
  colorStats: any;
  constructor() {}
}
