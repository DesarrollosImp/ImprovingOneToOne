import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import SignaturePad from 'signature_pad';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-firma',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './firma.component.html',
  styleUrl: './firma.component.scss'
})
export class FirmaComponent implements AfterViewInit {

  //titulo que se muestra encima del recuadro
  @Input() titulo = '';

  //evento que avisa al padre cada vez que la firma cambia
  //envia la firma en base64 o null si esta vacia o se ha borrado
  @Output() firmaCambiada = new EventEmitter<string | null>();

  //referencia al canvas del HTML.
  // "!" le dice a typeScript que tendra valor aunque no lo asignemos aqui
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  //instacia de la libreria
  private signaturePad!: SignaturePad;

  //se ejecuta cuando el HTML del componente ya esta pintado
  ngAfterViewInit(): void {
    
    //conecta la libreria con nuestro canvas para poder dibujar en el
    this.signaturePad = new SignaturePad(this.canvasRef.nativeElement);

    //cada vez que se termine un trazo, convierte la firma a imagen PNG en base64 y se la envia al padre
    this.signaturePad.addEventListener('endStroke', () => {
      this.firmaCambiada.emit(this.signaturePad.toDataURL());
    });
  }

  //se ejecuta al arrancar y cada vez que cambia el tamaño de la ventana
  @HostListener('window:resize')

  ajustarTamanio(): void{

    //elemento canvas real del navegador
    const canvas = this.canvasRef.nativeElement;

    //Densidad de pixeles de la pantalla (1 en monitores normales, 2 o 3 en moviles)
    const ratio = Math.max(window.devicePixelRatio || 1, 1);

    //ajusta la resolucion interna del canvas a su tamaño visible por esa densidad
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;

    //Escala el dibujo para que las coordenadas sigan coincidiendo con el puntero
    canvas.getContext('2d')!.scale(ratio, ratio);

    //al cambiar el tamaño del canva su contenido no se pierde
    // se limpia y se avisa que ya no hay firma
    this.signaturePad.clear();
    this.firmaCambiada.emit(null);
  }

  //boton borrar para limpiar el recuadro y avisa al padre de que la firma esta vacia
  borrar(): void{
    this.signaturePad.clear();
    this.firmaCambiada.emit(null);
  }
}
