import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-rotating-placeholder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-rotating-placeholder.component.html',
  styleUrls: ['./search-rotating-placeholder.component.css']
})
export class SearchRotatingPlaceholderComponent implements OnInit, OnDestroy {
  search = '';

  suggestions = [
    'Je cherche un produit',
    'Je cherche une référence',
    'Je cherche des gants',
    'Je cherche un distributeur',
    'Je cherche un savon mains',
    'Je cherche un essuie-mains'
  ];

  visibleText = signal('');
  isPaused = signal(false);

  private currentIndex = 0;
  private rotationInterval: ReturnType<typeof setInterval> | null = null;
  private typingTimeout: ReturnType<typeof setTimeout> | null = null;
  private isTyping = false;

  private rotationDelay = 2000;
  private typingSpeed = 10;

  ngOnInit(): void {
    this.typeText(this.suggestions[this.currentIndex]);
    this.startRotation();
  }

  ngOnDestroy(): void {
    if (this.rotationInterval) clearInterval(this.rotationInterval);
    if (this.typingTimeout) clearTimeout(this.typingTimeout);
  }

  onFocus(): void {
    this.isPaused.set(true);
  }

  onBlur(): void {
    if (!this.search.trim()) {
      this.isPaused.set(false);
    }
  }

  onInput(): void {
    this.isPaused.set(!!this.search.trim());
  }

  private startRotation(): void {
    this.rotationInterval = setInterval(() => {
      if (this.isPaused() || this.search.trim() || this.isTyping) {
        return;
      }

      this.currentIndex = (this.currentIndex + 1) % this.suggestions.length;
      this.typeText(this.suggestions[this.currentIndex]);
    }, this.rotationDelay);
  }

  private typeText(text: string): void {
    this.isTyping = true;
    this.visibleText.set('');

    let i = 0;

    const typeNext = () => {
      if (i <= text.length) {
        this.visibleText.set(text.slice(0, i));
        i++;
        this.typingTimeout = setTimeout(typeNext, this.typingSpeed);
      } else {
        this.isTyping = false;
      }
    };

    typeNext();
  }
}