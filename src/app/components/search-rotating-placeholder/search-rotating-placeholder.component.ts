import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-search-rotating-placeholder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-rotating-placeholder.component.html',
  styleUrls: ['./search-rotating-placeholder.component.css']
})
export class SearchRotatingPlaceholderComponent implements OnInit, OnDestroy {
  private searchService = inject(SearchService);

  search = '';
  fixedPrefix = 'Je cherche ';

  suggestions = [
    'une climatisation',
    'un chauffage',
    'des panneaux solaires',
    'une recharge d\'Aquakem',
  ];

  animatedText = signal('');
  isPaused = signal(false);

  private currentIndex = 0;
  private typingTimeout: ReturnType<typeof setTimeout> | null = null;
  private isRunning = false;

  private typingSpeed = 45;
  private deletingSpeed = 25;
  private pauseAfterTyping = 1200;
  private pauseBeforeRestart = 250;

  ngOnInit(): void {
    this.startLoop();
  }

  ngOnDestroy(): void {
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
  }

  onFocus(): void {
    this.isPaused.set(true);
  }

  onBlur(): void {
    if (!this.search.trim()) {
      this.isPaused.set(false);
      if (!this.isRunning) {
        this.startLoop();
      }
    }
  }

  onSearch(): void {
    const value = this.search.trim();

    this.isPaused.set(!!value);
    this.searchService.setSearchTerm(value);

    if (!value) {
      this.isPaused.set(false);
      if (!this.isRunning) {
        this.startLoop();
      }
    }
  }

  private startLoop(): void {
    if (this.isRunning) return;

    this.isRunning = true;
    this.runAnimation();
  }

  private runAnimation(): void {
    if (this.isPaused() || this.search.trim()) {
      this.isRunning = false;
      return;
    }

    const currentWord = this.suggestions[this.currentIndex];

    this.typeWord(currentWord, () => {
      this.wait(this.pauseAfterTyping, () => {
        this.deleteWord(currentWord, () => {
          this.currentIndex = (this.currentIndex + 1) % this.suggestions.length;

          this.wait(this.pauseBeforeRestart, () => {
            this.runAnimation();
          });
        });
      });
    });
  }

  private typeWord(word: string, done: () => void): void {
    let i = 0;

    const step = () => {
      if (this.isPaused() || this.search.trim()) {
        this.isRunning = false;
        return;
      }

      if (i <= word.length) {
        this.animatedText.set(word.slice(0, i));
        i++;
        this.typingTimeout = setTimeout(step, this.typingSpeed);
      } else {
        done();
      }
    };

    step();
  }

  private deleteWord(word: string, done: () => void): void {
    let i = word.length;

    const step = () => {
      if (this.isPaused() || this.search.trim()) {
        this.isRunning = false;
        return;
      }

      if (i >= 0) {
        this.animatedText.set(word.slice(0, i));
        i--;
        this.typingTimeout = setTimeout(step, this.deletingSpeed);
      } else {
        done();
      }
    };

    step();
  }

  private wait(duration: number, done: () => void): void {
    this.typingTimeout = setTimeout(() => {
      if (this.isPaused() || this.search.trim()) {
        this.isRunning = false;
        return;
      }

      done();
    }, duration);
  }
}