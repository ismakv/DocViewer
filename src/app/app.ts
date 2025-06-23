import { TuiRoot } from '@taiga-ui/core';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, TuiRoot],
    templateUrl: './app.html',
    styleUrl: './app.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
    protected title = 'DocViewer';
}
